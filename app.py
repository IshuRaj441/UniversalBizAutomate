import os
import uuid
import subprocess
import time
from datetime import datetime
from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

def get_system_info():
    """Get system information including installed tools"""
    tools = {
        'libreoffice': False,
        'pandoc': False,
        'imagemagick': False,
        'pdflatex': False,
        'poppler': False
    }
    try:
        subprocess.run(['soffice', '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        tools['libreoffice'] = True
    except:
        pass

    try:
        subprocess.run(['pandoc', '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        tools['pandoc'] = True
    except:
        pass

    try:
        subprocess.run(['magick', '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        tools['imagemagick'] = True
    except:
        pass

    try:
        subprocess.run(['pdflatex', '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        tools['pdflatex'] = True
    except:
        pass

    try:
        subprocess.run(['pdftoppm', '-v'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        tools['poppler'] = True
    except:
        pass

    return tools

def create_app():
    # Configuration
    UPLOAD_FOLDER = 'uploads'
    OUTPUT_FOLDER = 'outputs'
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'tex', 'jpg', 'jpeg', 'png'}

    # Ensure upload and output directories exist
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    # Get the absolute path to the frontend build directory
    frontend_build_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend', 'build'))

    app = Flask(__name__, static_folder=frontend_build_path, static_url_path='')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

    # Configure CORS
    CORS(app, 
        resources={"*": {"origins": ["http://localhost:3000", "http://localhost:3003", "http://127.0.0.1:3000", "http://127.0.0.1:3003", "file://", "*"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        methods=["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
        expose_headers=["Content-Disposition"]
    )

    # Application start time
    app.start_time = time.time()

    # Helper functions
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    # Routes
    @app.route('/')
    def serve():
        return app.send_static_file('index.html')

    @app.route('/favicon.ico')
    def favicon():
        """Serve favicon.ico"""
        # Return a simple 1x1 transparent PNG as fallback favicon
        import base64
        from flask import Response
        
        # Base64 encoded 1x1 transparent PNG
        favicon_data = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
        
        response = Response(favicon_data, mimetype='image/x-icon')
        return response

    @app.route('/api')
    def root():
        """Root API endpoint with service information"""
        return jsonify({
            'service': 'Universal Business Automator API',
            'version': '1.0.0',
            'status': 'operational',
            'endpoints': {
                'health': '/api/health',
                'status': '/api/status',
                'leads': '/api/leads',
                'tools': '/api/tools',
                'convert': '/api/convert'
            },
            'documentation': 'https://github.com/yourusername/uba-backend'
        })

    @app.route('/api/health')
    def health():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'uptime': round(time.time() - app.start_time, 2)
        })

    @app.route('/api/status')
    def status():
        """System status endpoint"""
        system_info = get_system_info()
        return jsonify({
            'status': 'operational' if all(system_info.values()) else 'degraded',
            'timestamp': datetime.utcnow().isoformat(),
            'system': {
                'tools': system_info,
                'missing_tools': [k for k, v in system_info.items() if not v]
            }
        })

    @app.route('/api/leads')
    def get_leads():
        """Get sample leads data"""
        return jsonify({
            'leads': [
                {
                    'id': 1,
                    'name': 'John Doe',
                    'email': 'john@example.com',
                    'company': 'Acme Inc',
                    'status': 'new',
                    'created_at': '2023-06-15T10:30:00Z'
                },
                {
                    'id': 2,
                    'name': 'Jane Smith',
                    'email': 'jane@example.com',
                    'company': 'Tech Corp',
                    'status': 'contacted',
                    'created_at': '2023-06-14T15:45:00Z'
                }
            ]
        })

    @app.route('/api/tools')
    def get_tools():
        """Get available conversion tools"""
        return jsonify({
            'tools': [
                {
                    'id': 'pdf_to_word',
                    'name': 'PDF to Word',
                    'description': 'Convert PDF documents to editable Word format',
                    'input_formats': ['pdf'],
                    'output_format': 'docx',
                    'enabled': True
                },
                {
                    'id': 'word_to_pdf',
                    'name': 'Word to PDF',
                    'description': 'Convert Word documents to PDF format',
                    'input_formats': ['docx', 'doc'],
                    'output_format': 'pdf',
                    'enabled': True
                }
            ]
        })

    @app.route('/api/convert', methods=['POST'])
    def convert():
        """Handle file conversion"""
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        action = request.form.get('action')
        if not action:
            return jsonify({'error': 'No action specified'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        uid = str(uuid.uuid4())
        filename = secure_filename(file.filename)
        base_name = os.path.splitext(filename)[0]
        
        in_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{uid}_{filename}")
        file.save(in_path)
        
        try:
            output_ext = ''
            out_filename = f"{uid}_{base_name}"
            
            if action == 'pdf_to_word':
                output_ext = '.docx'
                out_path = os.path.join(app.config['OUTPUT_FOLDER'], f"{out_filename}{output_ext}")
                
                # Use pdf2docx library for better PDF to DOCX conversion
                try:
                    from pdf2docx import Converter
                    
                    # Convert PDF to DOCX
                    cv = Converter(in_path)
                    cv.convert(out_path, start=0, end=None)
                    cv.close()
                    
                    print(f"Successfully converted PDF to DOCX using pdf2docx")
                    
                except ImportError:
                    # Fallback to LibreOffice if pdf2docx is not available
                    print("pdf2docx not available, falling back to LibreOffice")
                    libreoffice_path = r"C:\Program Files\LibreOffice\program\soffice.exe"
                    
                    try:
                        if os.path.exists(libreoffice_path):
                            result = subprocess.run([
                                libreoffice_path, '--headless', '--convert-to', 'docx',
                                '--outdir', app.config['OUTPUT_FOLDER'], in_path
                            ], capture_output=True, text=True, timeout=30)
                        else:
                            result = subprocess.run([
                                'soffice', '--headless', '--convert-to', 'docx',
                                '--outdir', app.config['OUTPUT_FOLDER'], in_path
                            ], capture_output=True, text=True, timeout=30)
                        
                        print(f"LibreOffice stdout: {result.stdout}")
                        print(f"LibreOffice stderr: {result.stderr}")
                        
                        if result.returncode != 0:
                            raise Exception(f"LibreOffice conversion failed with return code {result.returncode}")
                        
                    except Exception as e:
                        raise Exception(f"Both pdf2docx and LibreOffice conversion failed: {str(e)}")
                
                # Check if file was created
                if not os.path.exists(out_path):
                    # List all files in output directory for debugging
                    output_files = os.listdir(app.config['OUTPUT_FOLDER'])
                    print(f"Files in output directory: {output_files}")
                    
                    # Look for any file that starts with our uid
                    matching_files = [f for f in output_files if f.startswith(uid)]
                    if matching_files:
                        print(f"Found matching files: {matching_files}")
                        # Use the first matching file
                        out_path = os.path.join(app.config['OUTPUT_FOLDER'], matching_files[0])
                    else:
                        # Look for any .docx file in the output directory
                        docx_files = [f for f in output_files if f.endswith('.docx')]
                        if docx_files:
                            print(f"Found docx files: {docx_files}")
                            # Use the first docx file and rename it
                            old_path = os.path.join(app.config['OUTPUT_FOLDER'], docx_files[0])
                            os.rename(old_path, out_path)
                        else:
                            raise Exception(f"Conversion completed but output file not found. Available files: {output_files}")
                
            elif action == 'word_to_pdf':
                output_ext = '.pdf'
                out_path = os.path.join(app.config['OUTPUT_FOLDER'], f"{out_filename}{output_ext}")
                # Use full path to LibreOffice on Windows
                libreoffice_path = r"C:\Program Files\LibreOffice\program\soffice.exe"
                if os.path.exists(libreoffice_path):
                    subprocess.run([
                        libreoffice_path, '--headless', '--convert-to', 'pdf',
                        '--outdir', app.config['OUTPUT_FOLDER'], in_path
                    ], check=True)
                else:
                    subprocess.run([
                        'soffice', '--headless', '--convert-to', 'pdf',
                        '--outdir', app.config['OUTPUT_FOLDER'], in_path
                    ], check=True)
            else:
                os.remove(in_path)
                return jsonify({'error': 'Invalid action'}), 400
                
            return jsonify({
                'success': True,
                'download_url': f'/api/download/{uid}',
                'filename': f"{base_name}{output_ext}",
                'action': action,
                'timestamp': datetime.utcnow().isoformat()
            })
            
        except subprocess.CalledProcessError as e:
            if os.path.exists(in_path):
                os.remove(in_path)
            return jsonify({
                'error': f'Conversion failed: {str(e)}',
                'details': str(e.stderr) if hasattr(e, 'stderr') else 'No details available'
            }), 500
            
        except Exception as e:
            if os.path.exists(in_path):
                os.remove(in_path)
            return jsonify({
                'error': f'An unexpected error occurred: {str(e)}'
            }), 500

    @app.route('/api/download/<uid>')
    def download(uid):
        """Download converted files"""
        output_dir = app.config['OUTPUT_FOLDER']
        
        for filename in os.listdir(output_dir):
            if filename.startswith(uid):
                file_path = os.path.join(output_dir, filename)
                
                def cleanup():
                    try:
                        os.remove(file_path)
                    except:
                        pass
                        
                response = send_file(file_path, as_attachment=True)
                response.call_on_close(cleanup)
                return response
                
        return jsonify({'error': 'File not found or has expired'}), 404

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    return app

# For development
if __name__ == '__main__':
    app = create_app()
    
    # Check for required tools - access the function from the app context
    with app.app_context():
        # Get system info by calling the function directly
        system_info = get_system_info()
        missing_tools = [tool for tool, available in system_info.items() if not available]
        if missing_tools:
            print(f"Warning: The following required tools are missing: {', '.join(missing_tools)}")
            print("Some features may not work as expected.")
    
    # Run the application
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))