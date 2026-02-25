'use server';
/**
 * @fileOverview A Genkit flow for scanning prescription labels and extracting medication details.
 *
 * - scanPrescriptionForMedicationDetails - A function that handles the prescription scanning process.
 * - ScanPrescriptionInput - The input type for the scanPrescriptionForMedicationDetails function.
 * - ScanPrescriptionOutput - The return type for the scanPrescriptionForMedicationDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanPrescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a prescription label, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanPrescriptionInput = z.infer<typeof ScanPrescriptionInputSchema>;

const ScanPrescriptionOutputSchema = z.object({
  drugName: z
    .string()
    .describe(
      'The extracted name of the drug from the prescription label. If not found, return an empty string.'
    ),
  dosage: z
    .string()
    .describe(
      'The extracted dosage information (e.g., "10mg", "2 pills") from the prescription label. If not found, return an empty string.'
    ),
  frequency: z
    .string()
    .describe(
      'The extracted frequency of medication intake (e.g., "twice daily", "every 8 hours") from the prescription label. If not found, return an empty string.'
    ),
});
export type ScanPrescriptionOutput = z.infer<typeof ScanPrescriptionOutputSchema>;

export async function scanPrescriptionForMedicationDetails(
  input: ScanPrescriptionInput
): Promise<ScanPrescriptionOutput> {
  return scanPrescriptionForMedicationDetailsFlow(input);
}

const scanPrescriptionPrompt = ai.definePrompt({
  name: 'scanPrescriptionPrompt',
  input: {schema: ScanPrescriptionInputSchema},
  output: {schema: ScanPrescriptionOutputSchema},
  prompt: `You are an intelligent assistant designed to extract medication details from prescription labels.
Given an image of a prescription label, identify and extract the following information:
- Drug Name: The official name of the medication.
- Dosage: The amount of medication to be taken (e.g., "10mg", "2 tablets").
- Frequency: How often the medication should be taken (e.g., "once daily", "every 12 hours").

If any of the requested information is not clearly visible or identifiable, return an empty string for that field.

Here is the prescription label:
Photo: {{media url=photoDataUri}}`,
});

const scanPrescriptionForMedicationDetailsFlow = ai.defineFlow(
  {
    name: 'scanPrescriptionForMedicationDetailsFlow',
    inputSchema: ScanPrescriptionInputSchema,
    outputSchema: ScanPrescriptionOutputSchema,
  },
  async input => {
    const {output} = await scanPrescriptionPrompt(input, {
      model: 'googleai/gemini-1.5-flash',
    });
    return output!;
  }
);
