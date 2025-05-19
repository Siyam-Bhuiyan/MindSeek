import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createWorker } from 'tesseract.js';
import axios from 'axios';
import { Mic, MicOff, Send, X, Paperclip, Maximize2, Minimize2, BookOpen, ChevronRight, RotateCcw } from 'lucide-react';
// import Sidebar from '../Sidebar/Sidebar';
import './AIChat.css';

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [userNotes, setUserNotes] = useState([]);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const tesseractWorker = useRef(null);

  // Initialize Tesseract worker
  useEffect(() => {
    const initTesseract = async () => {
      tesseractWorker.current = await createWorker('eng');
    };
    
    initTesseract();
    
    return () => {
      if (tesseractWorker.current) {
        tesseractWorker.current.terminate();
      }
    };
  }, []);

  // Fetch user notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/notes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUserNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    
    fetchNotes();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle audio recording
  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudioToText(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processAudioToText = async (audioBlob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      // Send audio to backend for speech-to-text conversion
      const response = await axios.post('/api/speech-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data && response.data.text) {
        setInput(response.data.text);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload and processing
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // For images, use Tesseract OCR
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        const { data: { text } } = await tesseractWorker.current.recognize(imageUrl);
        
        if (text.trim()) {
          // Add extracted text as a user message
          handleSendMessage(text);
        }
        URL.revokeObjectURL(imageUrl);
      } 
      // For PDFs or other documents, send to backend
      else {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post('/api/extract-text', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data && response.data.text) {
          handleSendMessage(response.data.text);
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Error processing file. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendMessage = useCallback(async (messageText = input) => {
    if (!messageText.trim() && !selectedNote) return;
    
    const newUserMessage = {
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare request payload
      let payload = {
        message: messageText,
        userId: user._id,
      };
      
      // Add reference to selected note if any
      if (selectedNote) {
        payload.noteId = selectedNote._id;
      }
      
      // Make API request to Groq
      const response = await axios.post('/api/chat', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.response) {
        const botMessage = {
          type: 'bot',
          content: response.data.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, selectedNote, user]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectNoteForContext = (note) => {
    setSelectedNote(note);
    setShowNotesPanel(false);
    
    // Add a system message to indicate the context change
    setMessages(prev => [...prev, {
      type: 'system',
      content: `Now using "${note.title}" as context for our conversation.`
    }]);
  };

  const resetChat = () => {
    setMessages([]);
    setSelectedNote(null);
  };

  const toggleNotePanel = () => {
    setShowNotesPanel(!showNotesPanel);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar /> */}
      
      <div className={`ai-chat-container flex-1 flex flex-col ${fullScreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
        <div className="chat-header bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">AI Study Assistant</h1>
            {selectedNote && (
              <div className="ml-4 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm flex items-center">
                <BookOpen size={16} className="mr-1" />
                {selectedNote.title}
                <button 
                  onClick={() => setSelectedNote(null)} 
                  className="ml-2 hover:text-red-200"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={resetChat}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-10"
              title="Reset conversation"
            >
              <RotateCcw size={18} />
            </button>
            <button 
              onClick={toggleNotePanel}
              className={`p-2 rounded-full ${showNotesPanel ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
              title="Select note for context"
            >
              <BookOpen size={18} />
            </button>
            <button 
              onClick={() => setFullScreen(!fullScreen)}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-10"
              title={fullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {fullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
        
        <div className="chat-body flex-1 flex overflow-hidden">
          {/* Notes Panel (Slide-in) */}
          <div className={`notes-panel bg-gray-100 border-r border-gray-200 ${showNotesPanel ? 'w-72' : 'w-0'} transition-all duration-300 overflow-y-auto flex flex-col`}>
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0">
              <h2 className="font-bold text-gray-800">Select a Note for Context</h2>
              <p className="text-xs text-gray-500 mt-1">
                AI will use the selected note as context for your conversation
              </p>
            </div>
            
            <div className="p-2">
              {userNotes.length > 0 ? (
                userNotes.map(note => (
                  <div 
                    key={note._id}
                    onClick={() => selectNoteForContext(note)}
                    className="p-3 hover:bg-white rounded-lg mb-2 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-gray-800">{note.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No notes available
                </div>
              )}
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="messages-container flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
                  <BookOpen size={28} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">AI Study Assistant</h2>
                <p className="text-gray-500 max-w-md">
                  Ask me questions about your notes, generate quizzes, or get help with your studies.
                </p>
                {userNotes.length > 0 && (
                  <button 
                    onClick={toggleNotePanel}
                    className="mt-4 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg flex items-center hover:bg-indigo-100 transition-colors"
                  >
                    <BookOpen size={16} className="mr-2" />
                    Select a note for context
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`message ${message.type} flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3/4 p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : message.type === 'bot' 
                            ? 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm' 
                            : 'bg-gray-100 text-gray-600 text-sm py-2 px-3 mx-auto'
                      }`}
                    >
                      {message.content}
                      
                      {message.type !== 'system' && (
                        <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm rounded-bl-none max-w-3/4">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="chat-input-container bg-white border-t border-gray-200 p-4">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                className="w-full bg-gray-100 border border-gray-200 rounded-lg py-3 px-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ask me anything about your studies..."
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ minHeight: '50px', maxHeight: '150px' }}
              />
              
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-200"
                  title="Upload image or PDF"
                  disabled={isLoading}
                >
                  <Paperclip size={18} />
                </button>
                <button 
                  onClick={toggleRecording}
                  className={`p-2 rounded-full ${isRecording ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-200'}`}
                  title={isRecording ? 'Stop recording' : 'Start voice recording'}
                  disabled={isLoading}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              </div>
            </div>
            
            <button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-70 transition-all"
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!input.trim() && !selectedNote)}
            >
              <Send size={18} />
            </button>
          </div>
          
          {selectedNote && (
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <BookOpen size={12} className="mr-1" />
              Using {selectedNote.title} as context
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChat;