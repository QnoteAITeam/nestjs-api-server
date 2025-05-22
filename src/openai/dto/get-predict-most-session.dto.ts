import { ApiProperty } from '@nestjs/swagger';

export class GetPredictUserAnswerMostSessionDto {
  @ApiProperty()
  predicts: string[];
}
