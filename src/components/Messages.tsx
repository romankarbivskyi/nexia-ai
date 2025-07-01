import { Message as IMessage } from "@/types/message";
import Message from "./Message";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "./ui/button";

interface MessagesProps {
  messages: IMessage[];
  isLoading?: boolean;
  isFailed?: boolean;
  handleRegenerate?: () => void;
}

export default function Messages({
  messages,
  isLoading,
  isFailed,
  handleRegenerate,
}: MessagesProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-3 py-4 sm:px-4 sm:py-6">
      <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
        {messages && messages.length > 0 ? (
          messages.map(({ id, content, role }) => (
            <div key={id} className="max-w-full min-w-0">
              <Message content={content} role={role} />
            </div>
          ))
        ) : (
          <div className="text-muted-foreground flex min-h-[200px] flex-1 items-center justify-center">
            <p className="px-4 text-center text-sm sm:text-base">
              Start a conversation by typing a message below.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex w-full min-w-0">
            <div className="bg-card mr-auto max-w-[85%] rounded-xl border p-3 sm:max-w-[75%] sm:p-4 md:max-w-[70%] lg:max-w-[65%]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="bg-muted-foreground/60 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
                  <div className="bg-muted-foreground/60 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
                  <div className="bg-muted-foreground/60 h-2 w-2 animate-bounce rounded-full"></div>
                </div>
                <span className="text-muted-foreground text-sm">
                  AI is typing...
                </span>
              </div>
            </div>
          </div>
        )}

        {isFailed && (
          <div className="flex w-full min-w-0">
            <Alert
              variant="destructive"
              className="mr-auto max-w-[85%] space-y-2 sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%]"
            >
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle className="text-sm sm:text-base">
                Failed to generate response.
              </AlertTitle>
              {handleRegenerate && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive hover:border-destructive/80 text-xs sm:text-sm"
                  onClick={handleRegenerate}
                >
                  Regenerate
                </Button>
              )}
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
