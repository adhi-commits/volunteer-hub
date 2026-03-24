import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useToast } from '../hooks/useToast';

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: string;
    is_read: boolean;
}

interface Conversation {
    id: number;
    name: string;
    role: string;
    email: string;
    last_message?: string;
    unread_count?: number;
}

interface MessagingPanelProps {
    isOpen: boolean;
    onClose: () => void;
    initialContactId?: number | null;
}

const MessagingPanel: React.FC<MessagingPanelProps> = ({ isOpen, onClose, initialContactId }) => {
    const { showToast } = useToast();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [possibleContacts, setPossibleContacts] = useState<Conversation[]>([]);
    const [activeContact, setActiveContact] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const userId = Number(sessionStorage.getItem('userId'));

    useEffect(() => {
        if (isOpen && userId) {
            fetchConversations();
        }
    }, [isOpen, userId]);

    // Handle initial contact selection when opened via "Message" button
    useEffect(() => {
        if (isOpen && initialContactId && possibleContacts.length > 0) {
            const contact = possibleContacts.find(c => c.id === initialContactId) || conversations.find(c => c.id === initialContactId);
            if (contact) {
                openConversation(contact);
            }
        }
    }, [isOpen, initialContactId, possibleContacts]);

    const fetchConversations = async () => {
        try {
            const res = await fetch(api.messages.getConversations(userId));
            const data = await res.json();
            if (res.ok) {
                setConversations(data.existing_chats || []);
                setPossibleContacts(data.possible_contacts || []);
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    };

    const fetchMessages = async (otherId: number) => {
        setLoading(true);
        try {
            const res = await fetch(api.messages.getHistory(userId, otherId));
            const data = await res.json();
            if (res.ok) {
                setMessages(data);
                scrollToBottom();
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const openConversation = (contact: Conversation) => {
        setActiveContact(contact);
        fetchMessages(contact.id);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeContact) return;

        try {
            const res = await fetch(api.messages.send, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_id: userId,
                    receiver_id: activeContact.id,
                    content: newMessage.trim()
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessages(prev => [...prev, data.data]);
                setNewMessage('');
                scrollToBottom();
                fetchConversations(); // Update last message & unreads in background
            } else {
                showToast(data.error || 'Failed to send message', 'error');
            }
        } catch (error) {
            showToast('Network error', 'error');
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    if (!isOpen) return null;

    // Combine existing chats with possible contacts that aren't in existing chats
    const existingIds = new Set(conversations.map(c => c.id));
    const newContacts = possibleContacts.filter(c => !existingIds.has(c.id));
    const allList = [...conversations, ...newContacts];

    return (
        <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-2rem)] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-teal-600 text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-2">
                    {activeContact && (
                        <button onClick={() => { setActiveContact(null); fetchConversations(); }} className="hover:bg-teal-700 p-1 rounded transition">
                            <span className="material-icons text-xl block">arrow_back</span>
                        </button>
                    )}
                    <h3 className="font-bold text-lg">
                        {activeContact ? activeContact.name : 'Messages'}
                    </h3>
                </div>
                <button onClick={onClose} className="hover:bg-teal-700 p-1 rounded transition">
                    <span className="material-icons block">close</span>
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
                {!activeContact ? (
                    /* Conversation List */
                    <div className="divide-y divide-gray-100">
                        {allList.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                <span className="material-icons text-4xl text-gray-300 block mb-2">chat_bubble_outline</span>
                                No contacts available yet.
                            </div>
                        ) : (
                            allList.map(contact => (
                                <button
                                    key={contact.id}
                                    onClick={() => openConversation(contact)}
                                    className="w-full text-left p-4 hover:bg-teal-50 transition flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="font-bold text-gray-800 truncate">{contact.name}</span>
                                            {contact.role && (
                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full ml-2 capitalize">
                                                    {contact.role}
                                                </span>
                                            )}
                                        </div>
                                        {contact.last_message ? (
                                            <p className="text-sm text-gray-500 truncate">
                                                {existingIds.has(contact.id) ? 'Existing conversation' : 'Start a new conversation'}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">Click to message</p>
                                        )}
                                    </div>
                                    {contact.unread_count ? (
                                        <div className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shrink-0">
                                            {contact.unread_count}
                                        </div>
                                    ) : null}
                                </button>
                            ))
                        )}
                    </div>
                ) : (
                    /* Chat View */
                    <div className="flex-1 flex flex-col h-full bg-white relative">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-20">
                            {loading ? (
                                <div className="text-center text-gray-400 py-4">Loading messages...</div>
                            ) : messages.length === 0 ? (
                                <div className="text-center text-gray-400 py-8">
                                    <span className="material-icons text-4xl text-gray-300 block mb-2">waving_hand</span>
                                    Say hello to {activeContact.name}!
                                </div>
                            ) : (
                                messages.map(msg => {
                                    const isMine = msg.sender_id === userId;
                                    return (
                                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                                isMine 
                                                ? 'bg-teal-600 text-white rounded-br-none' 
                                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                            }`}>
                                                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                                                <span className={`text-[10px] block mt-1 ${isMine ? 'text-teal-200' : 'text-gray-400'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        {/* Message Input Box */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                <textarea
                                    className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 max-h-24 min-h-[40px]"
                                    placeholder="Type a message..."
                                    rows={1}
                                    value={newMessage}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!newMessage.trim()}
                                    className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                                >
                                    <span className="material-icons text-xl block ml-1">send</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagingPanel;
