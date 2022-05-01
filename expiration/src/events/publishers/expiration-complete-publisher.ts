import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent
} from "@zivhals-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
