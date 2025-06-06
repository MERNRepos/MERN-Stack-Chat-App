"use client";
import { Button, Field, Fieldset, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toaster.error({
                title: "Warning",
                description: "Please fill all the fields",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            return;
        } else if (password !== confirmPassword) {
            toaster.error({
                title: "Warning",
                description: "Password do not match",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            return;
        }
        try {
            const Config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = axios.post(
                "http://localhost:5001/api/user",
                {
                    name,
                    email,
                    password,
                    confirmPassword,
                    profilePic,
                },
                Config
            );
            toaster.success({
                title: "Success",
                description: "Registration successful",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        } catch (error) {
            console.log("Handle Submit Error", error);
            toaster.error({
                title: "Error",
                description: "Error occured",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            setLoading(false)
        }
        console.log({
            name,
            email,
            password,
            confirmPassword,
            profilePic,
        });
    };

    const postDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const file = e.target.files ? e.target.files[0] : null;
        console.log("e is", e);

        if (file === null) {
            toaster.error({
                title: "Warning",
                description: "Please select an image",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            return;
        } else if (
            (e.target.files && e.target.files[0].type === "image/jpeg") ||
            (e.target.files && e.target.files[0].type === "image/png")
        ) {
            const data = new FormData();
            data.append("file", e.target.files ? e.target.files[0] : "");
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "sagathiatejas");

            fetch("https://api.cloudinary.com/v1_1/sagathiatejas/image/upload", {
                method: "POST",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("data is", data);

                    setProfilePic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log("Upload Error is", err);
                    setLoading(false);
                });
        } else {
            toaster.success({
                title: "Warning",
                description: "Please select an image",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Fieldset.Root size="lg" maxW="md">
                <Stack spacing="4">
                    <Fieldset.Legend>Sign Up</Fieldset.Legend>
                    <Fieldset.HelperText>
                        Please enter your account details below.
                    </Fieldset.HelperText>
                </Stack>

                <Fieldset.Content>
                    {/* Name */}
                    <Field.Root>
                        <Field.Label color="teal.600">Name</Field.Label>
                        <Input
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            color="green.600"
                            _placeholder={{ color: "gray.400" }}
                            bg="white"
                            borderColor="teal.300"
                        />
                    </Field.Root>

                    {/* Email */}
                    <Field.Root>
                        <Field.Label color="teal.600">Email</Field.Label>
                        <Input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            color="green.600"
                            _placeholder={{ color: "gray.400" }}
                            bg="white"
                            borderColor="teal.300"
                        />
                    </Field.Root>

                    {/* Password */}
                    <Field.Root>
                        <Field.Label color="teal.600">Password</Field.Label>
                        <Input
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            color="green.600"
                            _placeholder={{ color: "gray.400" }}
                            bg="white"
                            borderColor="teal.300"
                        />
                    </Field.Root>

                    {/* Confirm Password */}
                    <Field.Root>
                        <Field.Label color="teal.600">Confirm Password</Field.Label>
                        <Input
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            color="green.600"
                            _placeholder={{ color: "gray.400" }}
                            bg="white"
                            borderColor="teal.300"
                        />
                    </Field.Root>

                    {/* Profile Picture */}
                    <Field.Root>
                        <Field.Label color="teal.600">Profile Picture</Field.Label>
                        <Input
                            name="profilePic"
                            type="file"
                            accept="image/*"
                            p={1}
                            onChange={(e) => postDetails(e)}
                            color="green.600"
                            _placeholder={{ color: "gray.400" }}
                            bg="white"
                            borderColor="teal.300"
                        />
                    </Field.Root>
                </Fieldset.Content>

                <Button
                    type="submit"
                    alignSelf="flex-start"
                    mt={4}
                    colorScheme="teal"
                    loading={loading}
                >
                    Register
                </Button>
            </Fieldset.Root>
        </form>
    );
};

export default SignupForm;
