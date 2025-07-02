import { Message as IMessage } from "@/types/message";
import Message from "./Message";
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
    <div className="xs:px-3 xs:py-4 mx-auto w-full max-w-3xl px-2 py-3 sm:px-4 sm:py-6">
      <div className="xs:gap-3 flex min-w-0 flex-col gap-2 sm:gap-4">
        {messages && messages.length > 0 ? (
          messages.map(({ id, content, role }) => (
            <div key={id} className="w-full min-w-0">
              <Message content={content} role={role} />
            </div>
          ))
        ) : (
          <div className="text-muted-foreground flex min-h-[30vh] flex-1 items-center justify-center sm:min-h-[40vh]">
            <div className="mx-auto max-w-sm px-3 text-center sm:px-4">
              <p className="mb-1 text-sm sm:text-base">
                Start a conversation by typing a message below.
              </p>
              <p className="text-muted-foreground/70 text-xs">
                Ask me anything!
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex w-full min-w-0">
            <div className="bg-card xs:p-3 xs:max-w-[90%] mr-auto max-w-[95%] rounded-xl border p-2 sm:max-w-[85%] sm:p-4 md:max-w-[80%] lg:max-w-[75%]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="bg-muted-foreground/60 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s] sm:h-2 sm:w-2"></div>
                  <div className="bg-muted-foreground/60 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s] sm:h-2 sm:w-2"></div>
                  <div className="bg-muted-foreground/60 h-1.5 w-1.5 animate-bounce rounded-full sm:h-2 sm:w-2"></div>
                </div>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  AI is typing...
                </span>
              </div>
            </div>
          </div>
        )}

        {isFailed && (
          <div className="flex w-full min-w-0">
            <div className="xs:max-w-[90%] xs:p-3 border-destructive bg-destructive/10 mr-auto max-w-[95%] space-y-1 rounded-xl border p-2 sm:max-w-[85%] sm:space-y-2 sm:p-4 md:max-w-[80%] lg:max-w-[75%]">
              <div className="flex items-center gap-2">
                <AlertCircleIcon className="text-destructive h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-destructive text-xs font-medium sm:text-sm">
                  Failed to generate response.
                </span>
              </div>
              {handleRegenerate && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive hover:border-destructive/80 text-destructive hover:bg-destructive h-6 px-2 text-xs hover:text-white sm:h-8 sm:px-3"
                  onClick={handleRegenerate}
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
