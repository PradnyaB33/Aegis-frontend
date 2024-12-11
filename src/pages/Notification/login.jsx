import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormLabel,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useHook from "./useHook";

const MyLogin = () => {
  const { loginMutate } = useHook();
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    role: z.string(),
  });
  const { handleSubmit, control, formState } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: undefined,
      password: undefined,
      role: undefined,
    },
  });

  return (
    <div className="pt-16">
      <form onSubmit={handleSubmit(loginMutate)} noValidate>
        <Stack spacing={2} width={400}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Email</FormLabel>
            <Controller
              name="email"
              type="email"
              control={control}
              render={({ field }) => {
                console.log("field", field);
                return (
                  <TextField
                    size="small"
                    {...field}
                    error={formState.errors.email ? true : false}
                    helperText={formState?.errors?.email?.message}
                  />
                );
              }}
            />
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel component="legend">Password</FormLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => {
                return (
                  <TextField
                    size="small"
                    {...field}
                    error={formState?.errors?.password}
                    helperText={formState?.errors?.password?.message}
                    type="password"
                  />
                );
              }}
            />
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel component="legend">Role</FormLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => {
                return (
                  <TextField
                    size="small"
                    {...field}
                    error={formState?.errors?.role}
                    helperText={formState?.errors?.role?.message}
                  />
                );
              }}
            />
          </FormControl>
          <Button
            disabled={!formState.isDirty}
            type="submit"
            variant="contained"
          >
            Apply for changes
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default MyLogin;
