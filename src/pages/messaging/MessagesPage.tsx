import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Profile, ConnectionRequest, Message } from '../../lib/supabase';
import { Footer } from '../../components/ui/Footer';
import {
  Chat,
  Send,
  ArrowBack,
  Circle,
  Check,
  DoneAll,
} from '@mui/icons-material';

interface ConnectionWithProfile extends ConnectionRequest {
  from_profile?: Profile;
  to_profile?: Profile;
}

interface MessageWithProfile extends Message {
  sender_name?: string;
}

export const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<ConnectionWithProfile[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<ConnectionWithProfile | null>(null);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedConnection) {
      loadMessages();
      subscribeToMessages();
    }
  }, [selectedConnection]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load my profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setMyProfile(profileData);

      if (!profileData) {
        navigate('/profile');
        return;
      }

      // Load connections where status is accepted
      const { data: connectionsData } = await supabase
        .from('connection_requests')
        .select(`
          *,
          from_profile:from_profile_id(id, child_name, child_profession, child_age),
          to_profile:to_profile_id(id, child_name, child_profession, child_age)
        `)
        .eq('status', 'accepted')
        .or(`from_profile_id.eq.${profileData.id},to_profile_id.eq.${profileData.id}`)
        .order('updated_at', { ascending: false });

      setConnections(connectionsData || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedConnection) return;

    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('connection_id', selectedConnection.id)
        .order('created_at', { ascending: true });

      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('connection_id', selectedConnection.id)
        .neq('sender_profile_id', myProfile?.id);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const subscribeToMessages = () => {
    if (!selectedConnection) return;

    const channel = supabase
      .channel(`messages:${selectedConnection.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `connection_id=eq.${selectedConnection.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConnection || !myProfile) return;

    try {
      setSending(true);

      const { error } = await supabase
        .from('messages')
        .insert({
          connection_id: selectedConnection.id,
          sender_profile_id: myProfile.id,
          content: newMessage.trim(),
          read: false,
        });

      if (error) throw error;

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherProfile = (connection: ConnectionWithProfile): Profile | undefined => {
    if (!myProfile) return undefined;
    return connection.from_profile_id === myProfile.id
      ? connection.to_profile
      : connection.from_profile;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #ffffff, #faf5ff, #ffffff)' }}>
        <div style={{ textAlign: 'center' }}>
          <Chat style={{ fontSize: 64, color: '#7C3AED' }} />
          <p style={{ fontSize: '18px', color: '#6B7280', marginTop: '16px' }}>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #ffffff, #faf5ff, #ffffff)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/browse')}
              style={{
                padding: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#6B7280',
              }}
            >
              <ArrowBack style={{ fontSize: 24 }} />
            </button>
            <Chat style={{ fontSize: 32, color: '#7C3AED' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Messages</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '1440px', margin: '0 auto', width: '100%', display: 'flex', overflow: 'hidden' }}>
        {/* Connections List */}
        <div style={{ width: '320px', borderRight: '1px solid #E5E7EB', background: '#ffffff', overflowY: 'auto' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
              Connections ({connections.length})
            </h2>
          </div>

          {connections.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#6B7280' }}>
              <Chat style={{ fontSize: 48, opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontSize: '14px' }}>No connections yet</p>
              <button
                onClick={() => navigate('/browse')}
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  background: '#7C3AED',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Browse Profiles
              </button>
            </div>
          ) : (
            <div>
              {connections.map((connection) => {
                const otherProfile = getOtherProfile(connection);
                if (!otherProfile) return null;

                return (
                  <div
                    key={connection.id}
                    onClick={() => setSelectedConnection(connection)}
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid #E5E7EB',
                      cursor: 'pointer',
                      background: selectedConnection?.id === connection.id ? '#F3F4F6' : '#ffffff',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedConnection?.id !== connection.id) {
                        e.currentTarget.style.background = '#F9FAFB';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedConnection?.id !== connection.id) {
                        e.currentTarget.style.background = '#ffffff';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: '#7C3AED',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: 600,
                        }}
                      >
                        {otherProfile.child_name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {otherProfile.child_name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {otherProfile.child_profession}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F9FAFB' }}>
          {selectedConnection ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '16px', background: '#ffffff', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#7C3AED',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 600,
                    }}
                  >
                    {getOtherProfile(selectedConnection)?.child_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                      {getOtherProfile(selectedConnection)?.child_name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Circle style={{ fontSize: 8, color: '#10B981' }} />
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
                    <p style={{ fontSize: '14px' }}>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {messages.map((message) => {
                      const isMyMessage = message.sender_profile_id === myProfile?.id;

                      return (
                        <div
                          key={message.id}
                          style={{
                            display: 'flex',
                            justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <div
                            style={{
                              maxWidth: '70%',
                              padding: '12px 16px',
                              borderRadius: '16px',
                              background: isMyMessage ? '#7C3AED' : '#ffffff',
                              color: isMyMessage ? '#ffffff' : '#111827',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                          >
                            <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '4px' }}>
                              {message.content}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                              <span style={{ fontSize: '11px', opacity: 0.7 }}>
                                {new Date(message.created_at).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </span>
                              {isMyMessage && (
                                message.read ? (
                                  <DoneAll style={{ fontSize: 14, opacity: 0.7 }} />
                                ) : (
                                  <Check style={{ fontSize: 14, opacity: 0.7 }} />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div style={{ padding: '16px', background: '#ffffff', borderTop: '1px solid #E5E7EB' }}>
                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sending}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '24px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7C3AED';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#D1D5DB';
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    style={{
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: 600,
                      background: !newMessage.trim() || sending ? '#9CA3AF' : '#7C3AED',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '24px',
                      cursor: !newMessage.trim() || sending ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Send style={{ fontSize: 16 }} />
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
              <div style={{ textAlign: 'center' }}>
                <Chat style={{ fontSize: 64, opacity: 0.3, marginBottom: '16px' }} />
                <p style={{ fontSize: '16px' }}>Select a connection to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
