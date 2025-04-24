import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, FileSpreadsheet, Link as LinkIcon } from 'lucide-react';
import { Document, Advisor } from '../types';

interface AdvisorCardProps {
  advisor: Advisor;
  documents: Document[];
}

const AdvisorCard: React.FC<AdvisorCardProps> = ({ advisor, documents }) => {
  const [showDeliverables, setShowDeliverables] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('spreadsheet')) return <FileSpreadsheet className="w-4 h-4" />;
    if (fileType.includes('doc')) return <FileText className="w-4 h-4" />;
    return <LinkIcon className="w-4 h-4" />;
  };

  const hasDocumentForDeliverable = (deliverable: string) => {
    return documents.some(doc => 
      doc.title.toLowerCase().includes(deliverable.toLowerCase()) ||
      doc.topic.toLowerCase().includes(deliverable.toLowerCase())
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <img
            src={advisor.profileImage}
            alt={advisor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shadow-md"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{advisor.title}</h3>
            <p className="text-sm text-blue-600 font-medium">{advisor.role}</p>
          </div>
        </div>

        {/* Bio */}
        {advisor.bio && (
          <p className="mt-4 text-sm text-gray-600 line-clamp-2">{advisor.bio}</p>
        )}

        {/* Key Deliverables */}
        <div className="mt-4">
          <button
            onClick={() => setShowDeliverables(!showDeliverables)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 rounded-lg text-white shadow-md hover:opacity-90 transition-all duration-300"
          >
            <span className="font-medium">Key Deliverables</span>
            {showDeliverables ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showDeliverables && advisor.responsibilities && (
            <ul className="mt-3 space-y-2.5 px-4">
              {advisor.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start text-sm group">
                  <div className="flex items-center mt-1 mr-2">
                    <span className="w-2 h-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full" />
                    {hasDocumentForDeliverable(item) && (
                      <FileText className="w-4 h-4 ml-2 text-blue-500" />
                    )}
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Documents */}
        <div className="mt-4">
          <button
            onClick={() => setShowDocuments(!showDocuments)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 rounded-lg text-white shadow-md hover:opacity-90 transition-all duration-300"
          >
            <span className="font-medium">Library Documents</span>
            {showDocuments ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showDocuments && (
            <ul className="mt-3 space-y-3">
              {documents.length === 0 ? (
                <li className="px-4 py-3 text-sm text-gray-500 bg-gray-50 rounded-lg">
                  No documents available
                </li>
              ) : (
                documents.map((doc) => (
                  <li key={doc.id} className="px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="text-blue-600 mt-1 mr-2">
                        {getFileIcon(doc.file_type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {doc.display_name}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {doc.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium group"
                        >
                          View Document
                          <LinkIcon className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvisorCard;