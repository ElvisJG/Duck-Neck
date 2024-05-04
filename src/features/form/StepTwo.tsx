import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";

interface absInterface {
  id: number;
  name: string;
  description: string;
}

const StepTwo = ({ form, exercises }: { form: any; exercises: any }) => {
  return (
    <div className="w-screen flex flex-col items-center space-y-8">
      <h1>Abs</h1>
      <FormField
        control={form.control}
        name="abs"
        render={() => (
          <FormItem>
            {exercises.abs.map((abs: absInterface) => (
              <FormField
                key={abs.id}
                control={form.control}
                name="abs"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={abs.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(abs.name)}
                          onCheckedChange={(checked) => {
                            const updatedValue = field.value || [];
                            if (checked) {
                              field.onChange([...updatedValue, abs.name]);
                            } else {
                              field.onChange(
                                updatedValue.filter(
                                  (value: string) => value !== abs.name
                                )
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{abs.name}</FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default StepTwo;
