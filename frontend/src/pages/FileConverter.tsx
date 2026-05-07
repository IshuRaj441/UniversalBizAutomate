import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Description as WordIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  SwapVert as ConvertIcon,
  Slideshow as PptIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

interface FileWithPreview extends File {
  id: string;
  preview?: string;
  status: 'uploading' | 'converting' | 'completed' | 'error';
  error?: string;
  downloadUrl?: string;
  outputFormat?: string;
  action?: string;
}

interface FileState {
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'ready' | 'uploading' | 'converting' | 'completed' | 'error';
  downloadUrl?: string;
  error?: string;
  outputFormat?: string;
  action?: string;
  preview?: string;
}

const SUPPORTED_FORMATS = {
  'pdf-to-docx': {
    label: 'PDF to Word',
    input: '.pdf',
    output: '.docx',
    icon: <WordIcon />,
    color: '#2b579a',
  },
  'docx-to-pdf': {
    label: 'Word to PDF',
    input: '.docx',
    output: '.pdf',
    icon: <PdfIcon />,
    color: '#d24726',
  },
  'ppt-to-docx': {
    label: 'PowerPoint to Word',
    input: ['.ppt', '.pptx'],
    output: '.docx',
    icon: <WordIcon />,
    color: '#2b579a',
  },
  'image-to-pdf': {
    label: 'Image to PDF',
    input: ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'],
    output: '.pdf',
    icon: <PdfIcon />,
    color: '#d24726',
  },
  'merge-pdf': {
    label: 'Merge PDFs',
    input: ['.pdf'],
    output: '.pdf',
    icon: <PdfIcon />,
    color: '#d24726',
  },
  'merge-images': {
    label: 'Merge Images to PDF',
    input: ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'],
    output: '.pdf',
    icon: <PdfIcon />,
    color: '#d24726',
  },
};

type ConversionType = keyof typeof SUPPORTED_FORMATS;

const FileConverter: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ConversionType>('pdf-to-docx');
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [fileState, setFileState] = useState<FileState | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFileState({
      file: selected,
      name: selected.name,
      size: selected.size,
      type: selected.type,
      status: "ready",
      action: activeTab.replace(/-/g, '_'),
      preview: selected.type.startsWith('image/') ? URL.createObjectURL(selected) : undefined
    });

    console.log("Selected file:", selected);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('onDrop called with files:', acceptedFiles);
    if (!acceptedFiles.length) return;

    const selected = acceptedFiles[0];
    handleFileChange({
      target: { files: [selected] }
    } as unknown as React.ChangeEvent<HTMLInputElement>);

    const newFiles = acceptedFiles.map(file => {
      console.log('Processing file:', file.name, file.size, file.type);
      const fileWithPreview = Object.assign(file, {
        id: Math.random().toString(36).substr(2, 9),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        status: 'uploading' as const,
        action: activeTab.replace(/-/g, '_'),
      });
      return fileWithPreview as FileWithPreview;
    });

    console.log('New files to add:', newFiles);
    setFiles(prevFiles => {
      const updated = [...prevFiles, ...newFiles];
      console.log('Updated files state:', updated);
      return updated;
    });
  }, [activeTab]);

  const getTargetFormat = (action: string) => {
    switch (action) {
      case "pdf-to-docx":
        return "DOCX";
      case "docx-to-pdf":
        return "PDF";
      case "ppt-to-docx":
        return "DOCX";
      case "image-to-pdf":
        return "PDF";
      case "merge-pdf":
        return "PDF";
      case "merge-images":
        return "PDF";
      default:
        return "FILE";
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: activeTab === 'merge-pdf' 
      ? { 'application/pdf': ['.pdf'] }
      : activeTab === 'merge-images'
      ? { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/bmp': ['.bmp'], 'image/tiff': ['.tiff'] }
      : {
          'application/pdf': ['.pdf'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
          'application/vnd.ms-powerpoint': ['.ppt'],
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/png': ['.png'],
          'image/bmp': ['.bmp'],
          'image/tiff': ['.tiff'],
        },
    multiple: true,
  });

  const handleConvert = async () => {
    console.log('Convert button clicked!');
    console.log('Current files state:', files);
    
    if (files.length === 0) {
      console.log('No files to convert');
      alert('Please select files first');
      return;
    }
    
    console.log('Starting conversion process...');
    setIsConverting(true);
    setError(null);

    try {
      // Update all files to converting status
      setFiles(prevFiles =>
        prevFiles.map(file => ({
          ...file,
          status: 'converting' as const,
        }))
      );

      // Check if this is a merge action
      const originalAction = activeTab.replace(/-/g, '_');
      const actionMap: Record<string, string> = {
        'pdf_to_docx': 'pdf_to_word',
        'docx_to_pdf': 'word_to_pdf',
        'ppt_to_docx': 'ppt_to_docx',
        'image_to_pdf': 'image_to_pdf',
        'merge_pdf': 'merge-pdf',
        'merge_images': 'merge-images'
      };
      const action = actionMap[originalAction] || originalAction;
      
      // For merge actions, require at least 2 files
      if ((action === 'merge-pdf' || action === 'merge-images') && files.length < 2) {
        console.log('Not enough files for merge');
        alert('Please select at least 2 files to merge');
        setIsConverting(false);
        return;
      }

      // Handle merge actions (multiple files in one request)
      if (action === 'merge-pdf' || action === 'merge-images') {
        console.log('Processing merge action with multiple files');
        
        const formData = new FormData();
        
        // Add all files to formData
        files.forEach((file, index) => {
          console.log(`Adding file ${index + 1} to merge:`, file.name);
          formData.append('files', file);
        });
        
        formData.append('action', action);
        
        console.log('Sending merge request...');
        const response = await api.post('/convert', formData, {
          headers: {
            'Content-Type': undefined,
          },
        });
        
        console.log('Merge API response:', response.data);
        
        // Update all files with the merge result
        setFiles(prevFiles => {
          return prevFiles.map(file => {
            const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
            const finalUrl = `${baseUrl}${response.data.download_url}`;
            
            return {
              ...file,
              status: 'completed' as const,
              downloadUrl: finalUrl,
              outputFormat: '.pdf',
            };
          });
        });
        
      } else {
        // Convert each file individually (existing logic)
        const conversionPromises = files.map(async (file) => {
          try {
            const formData = new FormData();
            console.log('File details:', {
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified
            });
            formData.append('file', file);
            // Map frontend actions to backend actions
            const actionMap: Record<string, string> = {
              'pdf_to_docx': 'pdf_to_word',
              'docx_to_pdf': 'word_to_pdf',
              'ppt_to_docx': 'ppt_to_docx',
              'image_to_pdf': 'image_to_pdf',
              'merge_pdf': 'merge-pdf',
              'merge_images': 'merge-images'
            };
            
            console.log('activeTab:', activeTab);
            console.log('file.action:', file.action);
            const originalAction = file.action || activeTab.replace(/-/g, '_');
            const action = actionMap[originalAction] || originalAction;
            
            console.log('Original action:', originalAction);
            console.log('Mapped action:', action);
            console.log('Available actions:', Object.keys(actionMap));
            
            // Ensure we're sending a valid backend action
            const validActions = ['pdf_to_word', 'word_to_pdf', 'ppt_to_docx', 'image_to_pdf', 'pdf_to_jpeg', 'pdf_to_latex', 'latex_to_pdf', 'merge-pdf', 'merge-images'];
            const finalAction = validActions.includes(action) ? action : 'pdf_to_word'; // fallback
            
            console.log('Final action being sent:', finalAction);
            formData.append('action', finalAction);

            const response = await api.post('/convert', formData, {
              headers: {
                'Content-Type': undefined,
              },
            });
            
            console.log('API response:', response.data);

            return {
              file,
              success: true,
              data: response.data,
            };
          } catch (error) {
            console.error('Conversion error for file:', file.name, error);
            
            // Type guard for axios error
            if (error && typeof error === 'object' && 'response' in error) {
              const axiosError = error as any;
              console.error('Error response:', axiosError.response?.data);
              console.error('Error status:', axiosError.response?.status);
              return {
                file,
                success: false,
                error: axiosError.response?.data?.error || (error instanceof Error ? error.message : 'Conversion failed'),
              };
            }
            
            return {
              file,
              success: false,
              error: error instanceof Error ? error.message : 'Conversion failed',
            };
          }
        });

        const results = await Promise.all(conversionPromises);
        
        console.log('Conversion results:', results);

        // Update files with conversion results
        setFiles(prevFiles => {
          console.log('Previous files state:', prevFiles);
          const updatedFiles = prevFiles.map(file => {
            const result = results.find(r => r.file.id === file.id);
            if (result) {
              if (result.success) {
                console.log('Updating file status to completed:', file.name);
                console.log('Backend download_url:', result.data.download_url);
                const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
                const finalUrl = `${baseUrl}${result.data.download_url}`;
                console.log('Base URL:', baseUrl);
                console.log('Final download URL:', finalUrl);
                return {
                  ...file,
                  status: 'completed' as const,
                  downloadUrl: finalUrl,
                  outputFormat: SUPPORTED_FORMATS[activeTab].output,
                };
              } else {
                console.log('Updating file status to error:', file.name);
                return {
                  ...file,
                  status: 'error' as const,
                  error: result.error,
                };
              }
            }
            return file;
          });
          console.log('Updated files state:', updatedFiles);
          return updatedFiles;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      
      // Update all files with error status
      setFiles(prevFiles =>
        prevFiles.map(file => ({
          ...file,
          status: 'error' as const,
          error: 'Conversion failed. Please try again.',
        }))
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleDownload = (file: FileWithPreview) => {
    if (!file.downloadUrl) return;
    
    // In a real app, this would trigger the download
    const link = document.createElement('a');
    link.href = file.downloadUrl;
    const baseName = file.name ? file.name.split('.')[0] : 'converted-file';
    link.download = `${baseName}${file.outputFormat || ''}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTabChange = (tab: ConversionType) => {
    setActiveTab(tab);
    setFiles([]);
  };

  // Clean up object URLs to avoid memory leaks
  React.useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const formatBytes = (bytes: number | undefined, decimals = 2) => {
    if (bytes === undefined || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    if (!fileName) return <FileIcon />;
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <PdfIcon />;
      case 'docx':
      case 'doc':
        return <WordIcon />;
      case 'ppt':
      case 'pptx':
        return <PptIcon />; // Using Slideshow icon for PowerPoint
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'bmp':
      case 'tiff':
        return <ImageIcon />;
      default:
        return <FileIcon />;
    }
  };

  const currentFormat = SUPPORTED_FORMATS[activeTab];
  const acceptedFiles = Array.isArray(currentFormat.input) 
    ? currentFormat.input.join(', ')
    : currentFormat.input;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        File Converter
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Convert between different file formats quickly and easily.
      </Typography>

      {/* Conversion Type Tabs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {(Object.keys(SUPPORTED_FORMATS) as ConversionType[]).map((key) => {
          const format = SUPPORTED_FORMATS[key];
          return (
            <Grid item key={key} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
              <Button
                variant={activeTab === key ? 'contained' : 'outlined'}
                startIcon={format.icon}
                onClick={() => handleTabChange(key)}
                sx={{
                  textTransform: 'none',
                  borderColor: activeTab === key ? format.color : 'inherit',
                  backgroundColor: activeTab === key ? format.color : 'transparent',
                  '&:hover': {
                    backgroundColor: activeTab === key ? format.color : 'action.hover',
                  },
                }}
              >
                {format.label}
              </Button>
            </Grid>
          );
        })}
      </Grid>

      {/* File Upload Area */}
      <Paper
        {...getRootProps()}
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          textAlign: 'center',
        }}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop the files here' : 'Drag & drop files here, or click to select files'}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Supported formats: {acceptedFiles.toUpperCase()}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => fileInputRef.current?.click()}>
          Select Files
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                {files.length} {files.length === 1 ? 'File' : 'Files'} to Convert
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={isConverting ? <CircularProgress size={20} color="inherit" /> : <ConvertIcon />}
                onClick={() => {
                  console.log('Convert button clicked directly!');
                  handleConvert();
                }}
                disabled={isConverting}
              >
                {isConverting ? 'Converting...' : `Convert to ${getTargetFormat(activeTab)}`}
              </Button>
            </Box>
            
            <List>
              {files.map((file, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: 'flex-start',
                      py: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" flexGrow={1} width="100%">
                      <Box sx={{ mr: 2, color: 'text.secondary' }}>
                        {file.preview ? (
                          <Box
                            component="img"
                            src={file.preview}
                            alt={file.name}
                            sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                          />
                        ) : (
                          <Box sx={{ fontSize: 40 }}>{getFileIcon(file.name)}</Box>
                        )}
                      </Box>
                      <Box flexGrow={1} minWidth={0}>
                        <Typography variant="subtitle2" noWrap>
                          {fileState?.name || file?.name || 'Unknown file'}
                        </Typography>
                        <Box display="flex" alignItems="center" flexWrap="wrap" mt={0.5}>
                          <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
                            {fileState?.size ? `${(fileState.size / 1024).toFixed(2)} KB` : formatBytes(file?.size)}
                          </Typography>
                          {file.status === 'completed' && (
                            <Chip
                              icon={<CheckCircleIcon fontSize="small" />}
                              label="Ready to download"
                              size="small"
                              color="success"
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          )}
                          {file.status === 'error' && (
                            <Chip
                              icon={<ErrorIcon fontSize="small" />}
                              label={file.error || 'Error'}
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          )}
                          {file.status === 'converting' && (
                            <Chip
                              icon={<CircularProgress size={16} color="info" />}
                              label="Converting..."
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: { xs: 2, sm: 0 }, display: 'flex', alignItems: 'center' }}>
                      {file.status === 'completed' && file.downloadUrl ? (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownload(file)}
                          sx={{ mr: 1 }}
                        >
                          Download
                        </Button>
                      ) : null}
                      <Tooltip title="Remove file">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                          disabled={file.status === 'converting'}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                  {index < files.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Conversion Tips */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Conversion Tips
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="High Quality Conversions" 
                secondary="Our conversion engine ensures your files maintain the highest possible quality."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Secure & Private" 
                secondary="Your files are automatically deleted from our servers after conversion."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="No Watermarks" 
                secondary="Converted files are free of watermarks or any other limitations."
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FileConverter;
