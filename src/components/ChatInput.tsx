"use client";

import { Send } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import ModelSelect from "./ModelSelect";

const formSchema = z.object({
  content: z.string().max(4000, "Message is too long"),
});

interface ChatInputProps {
  onSubmit?: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSubmit,
  disabled = false,
}: ChatInputProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      onSubmit(values.content);
      form.reset();
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  const isFormValid = form.watch("content")?.trim();

  return (
    <div className="w-full max-w-3xl px-2">
      <Card className="gap-2 rounded-3xl py-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="px-3">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        placeholder="Ask anything..."
                        className="max-h-32 min-h-[20px] resize-none border-0 bg-transparent p-0 text-sm focus:outline-none sm:text-base"
                        disabled={disabled || isSubmitting}
                        onKeyDown={handleKeyDown}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <ModelSelect />

              <Button
                type="submit"
                size="icon"
                className="h-8 w-8 flex-shrink-0 rounded-full sm:h-10 sm:w-10"
                disabled={!isFormValid || isSubmitting || disabled}
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
