import { useState, useEffect } from "react";
import { MessageCircle, Send, Loader2, User, Clock } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatUser {
  user_id: string;
  email: string | null;
  full_name: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface ChatMessage {
  id: string;
  user_id: string;
  sender_type: "user" | "admin";
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminSupport() {
  const { toast } = useToast();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchChatUsers();

    // Subscribe to new messages
    const channel = supabase
      .channel('admin-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          if (selectedUser && newMsg.user_id === selectedUser.user_id) {
            setMessages((prev) => [...prev, newMsg]);
          }
          // Refresh user list to update unread counts
          fetchChatUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser]);

  const fetchChatUsers = async () => {
    try {
      // Get all unique users who have sent messages
      const { data: chatMessages, error: chatError } = await supabase
        .from('chat_messages')
        .select('user_id, message, created_at, is_read, sender_type')
        .order('created_at', { ascending: false });

      if (chatError) throw chatError;

      // Get profiles for these users
      const userIds = [...new Set(chatMessages?.map(m => m.user_id) || [])];
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Build user list with last message info
      const userMap = new Map<string, ChatUser>();
      
      chatMessages?.forEach(msg => {
        if (!userMap.has(msg.user_id)) {
          const profile = profiles?.find(p => p.user_id === msg.user_id);
          userMap.set(msg.user_id, {
            user_id: msg.user_id,
            email: profile?.email || null,
            full_name: profile?.full_name || null,
            last_message: msg.message,
            last_message_time: msg.created_at,
            unread_count: 0
          });
        }
        // Count unread messages from users
        if (!msg.is_read && msg.sender_type === 'user') {
          const user = userMap.get(msg.user_id);
          if (user) {
            user.unread_count++;
          }
        }
      });

      setUsers(Array.from(userMap.values()));
    } catch (error) {
      console.error('Error fetching chat users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const selectUser = async (user: ChatUser) => {
    setSelectedUser(user);
    setLoadingMessages(true);

    try {
      // Fetch messages for this user
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as ChatMessage[]);

      // Mark messages as read
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('user_id', user.user_id)
        .eq('sender_type', 'user');

      // Update local unread count
      setUsers(prev => prev.map(u => 
        u.user_id === user.user_id ? { ...u, unread_count: 0 } : u
      ));
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setSending(true);
    try {
      const { error } = await supabase.from('chat_messages').insert({
        user_id: selectedUser.user_id,
        sender_type: 'admin',
        message: newMessage.trim(),
        is_read: false,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Support Chat</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage customer support conversations</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 h-[calc(100vh-12rem)] md:h-[600px]">
          {/* Users List */}
          <Card className={`lg:col-span-1 ${selectedUser ? 'hidden lg:flex' : 'flex'} flex-col`}>
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <User className="w-4 h-4" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full max-h-[400px] lg:max-h-none">
                {loadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No conversations yet
                  </div>
                ) : (
                  <div className="divide-y">
                    {users.map((user) => (
                      <button
                        key={user.user_id}
                        onClick={() => selectUser(user)}
                        className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                          selectedUser?.user_id === user.user_id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {user.full_name || user.email || 'Unknown User'}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {user.last_message}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-muted-foreground">
                              {new Date(user.last_message_time).toLocaleDateString()}
                            </span>
                            {user.unread_count > 0 && (
                              <Badge variant="default" className="text-xs">
                                {user.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className={`lg:col-span-2 flex-col ${selectedUser ? 'flex' : 'hidden lg:flex'}`}>
            {selectedUser ? (
              <>
                <CardHeader className="border-b pb-3 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span className="truncate">{selectedUser.full_name || selectedUser.email || 'Unknown User'}</span>
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="lg:hidden"
                      onClick={() => setSelectedUser(null)}
                    >
                      Back
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                msg.sender_type === 'admin'
                                  ? 'bg-primary text-primary-foreground rounded-br-md'
                                  : 'bg-muted rounded-bl-md'
                              }`}
                            >
                              <p className="text-sm">{msg.message}</p>
                              <div className={`flex items-center gap-1 mt-1 ${
                                msg.sender_type === 'admin' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}>
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">
                                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      disabled={sending}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={sending || !newMessage.trim()}>
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start chatting</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
