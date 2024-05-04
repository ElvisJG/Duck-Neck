import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Workout {
  id: number;
  name: string;
  description: string;
}

interface Exercise {
  name: string;
  workouts: Workout[];
}

const StepOne = ({ form, exercises }: { form: any; exercises: any }) => {
  const mainMuscle = form.watch("mainMuscle");
  const handleMainMuscleChange = (newValue: string) => {
    form.setValue("mainMuscle", newValue);
    form.setValue("mainSelections", []);
  };

  return (
    <div className="w-screen flex flex-col items-center space-y-8">
      <h1>Main Muscle</h1>
      <FormField
        control={form.control}
        name="mainMuscle"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                onValueChange={(newVal) => handleMainMuscleChange(newVal)}
                defaultValue={field.value}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a split" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Muscle Group</SelectLabel>
                    {exercises.main.map((exercise: Exercise) => (
                      <SelectItem
                        key={exercise.name}
                        value={exercise.name}
                        className="z-10"
                      >
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />

      {mainMuscle && (
        <FormField
          control={form.control}
          name="mainSelections"
          render={() => (
            <FormItem>
              {exercises.main
                .find((exercise: Exercise) => exercise.name === mainMuscle)
                .workouts.map((workout: Workout) => (
                  <FormField
                    key={workout.id}
                    control={form.control}
                    name="mainSelections"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={workout.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(workout.name)}
                              onCheckedChange={(checked) => {
                                const updatedValue = field.value || [];
                                if (checked) {
                                  field.onChange([
                                    ...updatedValue,
                                    workout.name,
                                  ]);
                                } else {
                                  field.onChange(
                                    updatedValue.filter(
                                      (value: string) => value !== workout.name
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {workout.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default StepOne;
