import { RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { apiClient } from "@/lib/apiClient";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const email = localStorage.getItem("emailForVerification") || "";

  const handleVerify = async () => {
    try {
      await apiClient.post("/auth/verify", {
        email,
        otp,
      });
      localStorage.removeItem("emailForVerification");
      toast.success("Email verified successfully. You can now log in.");
      window.location.href = "/login";
    } catch (error) {
      console.error("Verification failed", error);
      toast.error("Verification failed. Please try again.");
    }
  };
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Verify your login</CardTitle>
            <CardDescription>
              Enter the verification code we sent to your email address:{" "}
              <span className="font-medium">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="otp-verification">
                  Verification code
                </FieldLabel>
                <Button variant="outline" size="xs">
                  <RefreshCwIcon />
                  Resend Code
                </Button>
              </div>
              <InputOTP
                maxLength={6}
                id="otp-verification"
                required
                onChange={setOtp}
              >
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className="mx-2" />
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </Field>
          </CardContent>
          <CardFooter>
            <Field>
              <Button
                type="button"
                className="w-full"
                onClick={() => handleVerify()}
              >
                Verify
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
