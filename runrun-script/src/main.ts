import { calculateVotes } from "./calculateVotes";
import { sendSchedulesNextMonth } from "./sendSchedulesNextMonth";

(global as any).sendSchedulesNextMonth = sendSchedulesNextMonth;
(global as any).calculateVotes = calculateVotes;
