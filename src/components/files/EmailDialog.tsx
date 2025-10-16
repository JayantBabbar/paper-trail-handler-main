import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FileText, Mail } from "lucide-react";
import { format } from "date-fns";

interface EmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileTitle: string;
}

interface EmailThread {
  id: string;
  recipient_email: string;
  subject: string;
  message_body: string;
  created_at: string;
  status: string;
  cc_email?: string;
}

export function EmailDialog({ isOpen, onClose, fileId, fileTitle }: EmailDialogProps) {
  const { toast } = useToast();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [ccEmail, setCcEmail] = useState("office@example.com");
  const [subject, setSubject] = useState(`Regarding File: ${fileTitle}`);
  const [messageBody, setMessageBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailThreads, setEmailThreads] = useState<EmailThread[]>([]);

  useEffect(() => {
    if (isOpen && fileId) {
      loadEmailThreads();
    }
  }, [isOpen, fileId]);

  const loadEmailThreads = async () => {
    const { data, error } = await supabase
      .from('email_threads')
      .select('*')
      .eq('file_id', fileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading email threads:', error);
      return;
    }

    setEmailThreads(data || []);
  };

  const handleSend = async () => {
    if (!recipientEmail || !subject || !messageBody) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSending(true);

    try {
      // Get the file URL first
      const { data: fileData, error: fileError } = await supabase
        .from('files')
        .select('storage_path')
        .eq('id', fileId)
        .single();

      if (fileError) {
        throw new Error(`Failed to fetch file data: ${fileError.message}`);
      }

      if (!fileData?.storage_path) {
        throw new Error('No file attached to this record');
      }

      console.log('Fetched file data:', fileData);

      // Get a signed URL for the file
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('files')
        .createSignedUrl(fileData.storage_path, 3600);

      if (urlError) {
        throw new Error(`Failed to generate signed URL: ${urlError.message}`);
      }

      if (!signedUrlData?.signedUrl) {
        throw new Error('Could not generate file download URL');
      }

      console.log('Generated signed URL successfully');

      // Send email with attachment
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: JSON.stringify({
          recipientEmail,
          ccEmail,
          subject,
          messageBody,
          fileUrl: signedUrlData.signedUrl,
          fileName: fileData.storage_path.split('/').pop()
        })
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        throw new Error(`Failed to send email: ${emailError.message}`);
      }

      console.log('Email sent successfully');

      // Insert into email_threads with the correct schema
      const { error: threadError } = await supabase
        .from('email_threads')
        .insert({
          file_id: fileId,
          recipient_email: recipientEmail,
          cc_email: ccEmail,
          subject: subject,
          message_body: messageBody,
          sender_email: 'system@example.com',
          status: 'sent'
        });

      if (threadError) {
        console.error('Error recording email thread:', threadError);
        throw new Error(`Failed to record email thread: ${threadError.message}`);
      }

      await loadEmailThreads();

      toast({
        title: "Success",
        description: "Email sent successfully",
      });

      // Clear form
      setMessageBody("");
      setRecipientEmail("");
      setSubject(`Regarding File: ${fileTitle}`);

    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send email. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
          <DialogDescription>
            Send an email regarding this file
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          {/* Email Form */}
          <div className="space-y-4">
            <Input
              placeholder="Recipient Email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <Input
              placeholder="CC Email"
              value={ccEmail}
              onChange={(e) => setCcEmail(e.target.value)}
            />
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea
              placeholder="Message"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              rows={5}
            />
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Attached: {fileTitle}</span>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={isSending}>
                {isSending ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>

          {/* Email Threads */}
          <div className="border-l pl-6">
            <h3 className="text-sm font-medium mb-4">Email History</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {emailThreads.length === 0 ? (
                <p className="text-sm text-muted-foreground">No previous emails sent</p>
              ) : (
                emailThreads.map((thread) => (
                  <div key={thread.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{thread.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          To: {thread.recipient_email}
                        </p>
                        {thread.cc_email && (
                          <p className="text-xs text-muted-foreground">
                            CC: {thread.cc_email}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(thread.created_at), "PPpp")}
                        </p>
                        <div className="mt-2 text-sm">
                          {thread.message_body}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
