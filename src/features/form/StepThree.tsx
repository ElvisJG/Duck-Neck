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

const StepThree = ({ form, exercises }: { form: any; exercises: any }) => {
  const bonusMuscle = form.watch("bonusMuscle");
  const handleSecondaryMuscleChange = (newValue: string) => {
    form.setValue("bonusMuscle", newValue);
    form.setValue("bonusSelections", []);
  };

  return (
    <div className="w-screen flex flex-col items-center space-y-8">
      <h1>Secondary Training</h1>
      <FormField
        control={form.control}
        name="bonusMuscle"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                onValueChange={(newVal) => handleSecondaryMuscleChange(newVal)}
                defaultValue={field.value}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a split" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Secondary Muscle</SelectLabel>
                    {exercises.bonus.map((exercise: any) => (
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

      {bonusMuscle && (
        <FormField
          control={form.control}
          name="bonusSelections"
          render={() => (
            <FormItem>
              {exercises.bonus
                .find((exercise: Exercise) => exercise.name === bonusMuscle)
                .workouts.map((workout: Workout) => (
                  <FormField
                    key={workout.id}
                    control={form.control}
                    name="bonusSelections"
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

export default StepThree;
