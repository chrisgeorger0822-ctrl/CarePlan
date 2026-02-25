'use server';
/**
 * @fileOverview A Genkit flow for checking potential severe drug interactions.
 *
 * - getDrugInteractionAlert - A function that checks for drug interactions.
 * - DrugInteractionInput - The input type for the getDrugInteractionAlert function.
 * - DrugInteractionOutput - The return type for the getDrugInteractionAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationSchema = z.object({
  name: z.string().describe('The name of the medication.'),
  dosage: z.string().describe('The dosage of the medication (e.g., "10mg", "once daily").'),
  frequency: z.string().describe('How often the medication is taken (e.g., "daily", "twice a day").'),
});

const DrugInteractionInputSchema = z.object({
  newMedication: MedicationSchema.describe('Details of the new medication being added.'),
  existingMedications: z.array(MedicationSchema).describe('A list of medications the patient is currently taking.'),
});
export type DrugInteractionInput = z.infer<typeof DrugInteractionInputSchema>;

const DrugInteractionOutputSchema = z.object({
  hasInteraction: z.boolean().describe('True if a severe drug interaction is detected, false otherwise.'),
  warningMessage: z
    .string()
    .describe(
      'A clear, non-medical warning message if hasInteraction is true; otherwise, an empty string.'
    ),
});
export type DrugInteractionOutput = z.infer<typeof DrugInteractionOutputSchema>;

export async function getDrugInteractionAlert(
  input: DrugInteractionInput
): Promise<DrugInteractionOutput> {
  return getDrugInteractionAlertFlow(input);
}

const drugInteractionPrompt = ai.definePrompt({
  name: 'drugInteractionPrompt',
  input: {schema: DrugInteractionInputSchema},
  output: {schema: DrugInteractionOutputSchema},
  prompt: `You are a helpful AI assistant that checks for severe drug interactions.

Given a new medication and a list of existing medications, determine if there are any severe interactions between the new medication and any of the existing ones. Severe interactions are those that could cause serious harm or significantly impact patient health.

If a severe interaction is detected, provide a clear, concise warning message in simple, non-medical language, explaining the potential issue and advising to consult a doctor. The warning message should start with "Warning:".

If no severe interaction is found, indicate that there is no severe interaction.

New Medication:
- Name: {{{newMedication.name}}}
- Dosage: {{{newMedication.dosage}}}
- Frequency: {{{newMedication.frequency}}}

Existing Medications:
{{#if existingMedications}}
{{#each existingMedications}}
- Name: {{{this.name}}}
- Dosage: {{{this.dosage}}}
- Frequency: {{{this.frequency}}}
{{/each}}
{{else}}
None
{{/if}}

Please output your response as a JSON object with two fields: 'hasInteraction' (boolean) and 'warningMessage' (string). If 'hasInteraction' is false, 'warningMessage' should be an empty string. If 'hasInteraction' is true, 'warningMessage' should contain the warning message as described above.`,
});

const getDrugInteractionAlertFlow = ai.defineFlow(
  {
    name: 'getDrugInteractionAlertFlow',
    inputSchema: DrugInteractionInputSchema,
    outputSchema: DrugInteractionOutputSchema,
  },
  async input => {
    const {output} = await drugInteractionPrompt(input);
    return output!;
  }
);
