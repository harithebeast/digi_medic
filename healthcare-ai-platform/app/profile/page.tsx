"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes } from "@/components/ui/background-boxes"

export default function Profile() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        alert("You are not authenticated. Please sign in.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const result = await res.json();
      console.log("Profile updated:", result);
      router.push("/");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Please provide additional information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Select onValueChange={(value) => setValue("gender", value)} defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message as string}</p>}
            </div>
            <div>
              <Input {...register("age", { required: "Age is required", valueAsNumber: true })} type="number" placeholder="Age" />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message as string}</p>}
            </div>
            <div>
              <Input {...register("weight", { required: "Weight is required", valueAsNumber: true })} type="number" placeholder="Weight (kg)" />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message as string}</p>}
            </div>
            <div>
              <Input {...register("height", { required: "Height is required", valueAsNumber: true })} type="number" placeholder="Height (cm)" />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message as string}</p>}
            </div>
            <div>
              <Input {...register("nationality", { required: "Nationality is required" })} placeholder="Nationality" />
              {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality.message as string}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="h-ful relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
            <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      
            <Boxes />
    </div> </div>
  );
}
