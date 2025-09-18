import React, { useState } from 'react';
import { Mail, Send, User, MessageSquare } from 'lucide-react';
import ContactForm from '../components/Forms/ContactForm';

const Contact = () => {
  const [sentMessages, setSentMessages] = useState([]);

  const handleMessageSent = (messageData) => {
    setSentMessages(prev => [
      {
        ...messageData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600">Test contact form and view sent messages</p>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-primary-600" />
          <span className="text-sm text-gray-600">
            {sentMessages.length} message{sentMessages.length !== 1 ? 's' : ''} sent
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Send Test Message</h2>
            <Send className="h-5 w-5 text-gray-400" />
          </div>
          <ContactForm onSuccess={handleMessageSent} />
        </div>

        {/* Recent Messages */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
          
          {sentMessages.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No messages sent yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Use the form to test the contact functionality
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sentMessages.map((message) => (
                <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{message.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{message.email}</p>
                    {message.subject && (
                      <p className="text-sm font-medium text-gray-800">
                        Subject: {message.subject}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Email</h3>
            <p className="text-sm text-gray-600">Messages are sent to the configured email address</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Delivery</h3>
            <p className="text-sm text-gray-600">Messages are delivered via SMTP configuration</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Response</h3>
            <p className="text-sm text-gray-600">Auto-reply functionality can be configured</p>
          </div>
        </div>
      </div>

      {/* API Information */}
      <div className="card bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">API Endpoint Information</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium text-blue-800">Endpoint:</span>
            <code className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              POST /api/contact
            </code>
          </div>
          <div>
            <span className="font-medium text-blue-800">Required Fields:</span>
            <span className="ml-2 text-blue-700">name, email, message</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Optional Fields:</span>
            <span className="ml-2 text-blue-700">subject</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">Response:</span>
            <span className="ml-2 text-blue-700">JSON with success status</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;