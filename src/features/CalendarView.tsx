"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import StepOne from "./form/StepOne";
import { DumbbellIcon } from "lucide-react";
import { IconLeft, IconRight } from "react-day-picker";
import exercises from "@/data/exercises.json";
import { useEffect, useState } from "react";
import StepTwo from "./form/StepTwo";
import StepThree from "./form/StepThree";
import { createClient } from "@/utils/supabase/client";

const FormSchema = z.object({
  date: z.any({
    required_error: "A date is required.",
  }),
  mainMuscle: z.string({
    required_error: "A main muscle is required.",
  }),
  mainSelections: z
    .array(z.string())
    .refine((value) => value.some((selection) => selection), {
      message: "You have to select at least one exercise.",
    }),
  abs: z.array(z.string()).refine((value) => value.some((abs) => abs), {
    message: "You have to select at least one abdominal exercise.",
  }),
  bonusMuscle: z.string({
    required_error: "A bonus muscle is required.",
  }),
  bonusSelections: z.array(z.string()),
});

export function CalendarView({ savedExercises }: { savedExercises: any }) {
  const [steps, setSteps] = useState(1);
  const utcHour = 4;
  const today = new Date();
  today.setUTCHours(utcHour, 0, 0, 0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: today,
      mainMuscle: "",
      mainSelections: [],
      abs: [],
      bonusMuscle: "",
      bonusSelections: [],
    },
  });

  const supabase = createClient();

  async function onSubmit(formData: z.infer<typeof FormSchema>, event: any) {
    event.preventDefault();

    const {
      date,
      mainMuscle,
      mainSelections,
      abs,
      bonusMuscle,
      bonusSelections,
    } = formData;

    const exercise = {
      date,
      mainMuscle,
      mainSelections,
      abs,
      bonusMuscle,
      bonusSelections,
    };

    const { data } = await supabase
      .from("exercises")
      .insert([{ exercise }])
      .select();

    if (data) {
      savedExercises.push(data[0]);
    }
  }

  const resetSteps = () => {
    setSteps(1);
    form.setValue("mainMuscle", "");
    form.setValue("mainSelections", []);
    form.setValue("abs", []);
    form.setValue("bonusMuscle", "");
    form.setValue("bonusSelections", []);
  };

  const formDate = new Date(form.watch("date")).toISOString();

  const exercisesFromDB = savedExercises.find(
    (exercise: any) =>
      new Date(exercise?.exercise?.date).toISOString() === formDate
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center min-h-screen space-y-4"
      >
        <p className="flex items-center justify-center">
          Duck Neck <DumbbellIcon className="ml-2 w-5 h-5" />
        </p>

        <FormField
          control={form.control}
          name="date"
          defaultValue={new Date()}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calendar</FormLabel>
              <FormControl>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  onDayClick={() => resetSteps()}
                  initialFocus
                  className="rounded-md border"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {exercisesFromDB && (
          <div
            className="h-full min-h-full min-w-full w-full pb-4
            space-y-2 overflow-y-scroll scrollbar-hide whitespace-nowrap"
          >
            <h1 className="text-2xl">Today&rsquo;s Workout</h1>
            <p className="underline text-xl">
              {exercisesFromDB.exercise.mainMuscle}
            </p>
            {exercisesFromDB.exercise.mainSelections.map((exercise: any) => (
              <p key={exercise}>{exercise}</p>
            ))}
            <p className="underline text-xl">Abdominals</p>
            {exercisesFromDB.exercise.abs.map((exercise: any) => (
              <p key={exercise}>{exercise}</p>
            ))}
            <p className="underline text-xl">
              {exercisesFromDB.exercise.bonusMuscle}
            </p>
            {exercisesFromDB.exercise.bonusSelections.map((exercise: any) => (
              <p key={exercise}>{exercise}</p>
            ))}
          </div>
        )}

        {formDate && !exercisesFromDB && (
          <div className="w-screen flex flex-col items-center relative">
            <div className="flex w-screen justify-between px-8">
              <Button
                onClick={() => {
                  if (steps > 1) {
                    setSteps(steps - 1);
                  }
                }}
                className="z-50"
                disabled={steps === 1}
              >
                <IconLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={() => {
                  if (steps < 3) {
                    setSteps(steps + 1);
                  }
                }}
                className="z-50"
                disabled={steps === 3}
              >
                <IconRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute top-0">
              {steps === 1 && <StepOne form={form} exercises={exercises} />}
              {steps === 2 && <StepTwo form={form} exercises={exercises} />}
              {steps === 3 && <StepThree form={form} exercises={exercises} />}
            </div>
          </div>
        )}

        {steps === 3 && !exercisesFromDB && (
          <Button
            type="submit"
            className="fixed bottom-5"
            // disabled={!form.formState.isValid}
          >
            Lock In
            <LockClosedIcon className="ml-4" />
          </Button>
        )}
      </form>
    </Form>
  );
}
