"use client";
import { SignInInputs, SignInSchema } from "@/validators/signin-validator";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInUserAction } from "@/actions/signin-user-action";

export default function SignInForm() {
  const form = useForm<SignInInputs>({
    resolver: valibotResolver(SignInSchema),
    defaultValues: {
      domainName: "",
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control, formState, setError } = form;

  const submit = async (data: SignInInputs) => {
    const res = await signInUserAction(data);

    if (res.success) {
      window.location.href = "/profile";
    } else {
      switch (res.statusCode) {
        case 401:
          setError("password", { message: res.error });
          break;
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("password", { message: error });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(submit)}
        className="max-w-[400px] space-y-8"
        autoComplete="off"
      >
        <FormField
          control={control}
          name="domainName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g. MyCompany" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="e.g. john.smith@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full"
        >
          Sign in
        </Button>
      </form>
    </Form>
  );
}
