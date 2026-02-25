import { config } from 'dotenv';
config();

import '@/ai/flows/scan-prescription-for-medication-details.ts';
import '@/ai/flows/get-drug-interaction-alert-flow.ts';