import React from 'react';

const Message: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
      <p className="text-gray-600">View and manage your messages.</p>
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">You have 20 unread messages</p>
      </div>
    </div>
  );
};

export default Message;
