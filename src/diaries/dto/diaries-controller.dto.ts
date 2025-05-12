export class CreateDiaryDto {
  title: string;
  content: string;
  tags: string[]; // tag names
  emotionTags: string[]; // emotion tag names
}
