import * as Shared from 'openai/resources/shared';
import * as dotenv from 'dotenv';
import { AIRequestMessage } from './dto/openai-request.dto';
import OpenAI from 'openai';
import { WrittenDiary } from './dto/get-diary.dto';
import {
  assistant2,
  summaryAssistantThird,
} from 'src/commons/constants/prompts';
import { ChatCompletion } from 'openai/resources/chat';
import { BadRequestException } from '@nestjs/common';
import { ResponseMessageDto } from './dto/send-message.dto';

dotenv.config();

async function getDiaryInfoByContent(content: string): Promise<WrittenDiary> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model: Shared.ChatModel = 'gpt-3.5-turbo';

  const messages: AIRequestMessage[] = [
    { role: 'system', content: summaryAssistantThird },
    { role: 'user', content: content },
  ];

  try {
    const apiResponse: ChatCompletion = await openai.chat.completions.create({
      model: model,
      messages,
    });

    const response = apiResponse.choices[0].message;
    const parsing = JSON.parse(response.content!) as WrittenDiary;

    return parsing;
  } catch (error) {
    console.error('OpenAI API 에러:', error);
    throw new Error('OpenAI API 요청 실패');
  }
}

async function sendMessageToAI(message: string): Promise<ResponseMessageDto> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model: Shared.ChatModel = 'gpt-3.5-turbo';

  const messages: AIRequestMessage[] = [
    { role: 'system', content: assistant2 },
    { role: 'user', content: message },
  ];

  try {
    const apiResponse: ChatCompletion = await openai.chat.completions.create({
      model: model,
      messages,
    });

    const response = apiResponse.choices[0].message;

    console.log(response.content!);

    const parsing = JSON.parse(response.content!) as ResponseMessageDto;

    return parsing;
  } catch (error) {
    console.error('OpenAI API 에러:', error);
    throw new Error('OpenAI API 요청 실패');
  }
}

function isEnglishOnly(text: string): boolean {
  // 영어 대소문자, 숫자, 공백, 기본 구두점(.,!?'") 만 허용
  const englishRegex = /^[A-Za-z0-9 .,!?'"-]*$/;
  return englishRegex.test(text);
}

describe('OpenAIService', () => {
  it('Environment 파일을 가지고 올 수 있는지에 대한 테스트', () => {
    console.log(process.env.DB_NAME);
  });

  it('OPEN AI 가 한글 일기를 제대로 요약할 수 있는 지에 대한 테스트', async () => {
    const input =
      '오늘은 아침부터 하늘이 맑고 푸르러서 기분 좋은 하루의 시작을 알렸다. 출근길에 만난 가로수에는 봄꽃이 피어 있었고, 부드러운 바람이 살랑살랑 불어와 마음까지 상쾌해졌다. 회사에 도착해서는 오랜만에 팀원들과 활기찬 회의를 진행했다. 서로의 의견을 나누면서 아이디어가 샘솟는 순간들이 참 즐거웠다. 점심시간에는 새로 생긴 작은 카페에서 고소한 아메리카노와 신선한 샐러드를 먹었는데, 조용한 분위기 덕분에 잠시나마 마음의 여유를 느낄 수 있었다. 오후 내내 업무에 집중하며 중요한 프로젝트를 하나씩 처리했다. 일과를 마치고 집으로 돌아오는 길, 저녁노을이 붉게 물든 하늘을 보며 잠시 멈춰 서서 깊은 생각에 잠겼다. 집에 돌아와서는 따뜻한 차를 마시며 좋아하는 책을 펼쳤고, 오늘 하루가 소소하지만 의미 있었던 순간들로 가득했다는 생각에 마음 한켠이 따뜻해졌다.';

    try {
      //service에 있는 함수 그대로 가져다가 박아버림.
      const result = await getDiaryInfoByContent(input);
      console.log(JSON.stringify(result));
    } catch (err) {
      console.warn(err);
      throw new BadRequestException(
        'GetDiaryInfoByContent Function cause error',
      );
    }
  }, 10000);

  it('OPEN AI 가 영어 일기를 제대로 요약할 수 있는 지에 대한 테스트', async () => {
    const input = `
    I woke up earlier than usual today, greeted by the soft, warm sunlight filtering through my window. It instantly brightened my mood and gave me a gentle start to the day. Over a cup of coffee, I thoughtfully planned my schedule. At work, a few unexpected challenges arose, but with the support and teamwork of my colleagues, I managed to overcome them smoothly. During lunch, I met a good friend, and we enjoyed a delicious meal together, sharing laughter and catching up on life. In the evening, I went for a calming walk, letting the cool breeze and quiet surroundings help me reflect on the day. Despite the busyness, these simple moments of connection and peace made me feel truly grateful and content.
    `;

    try {
      const result = await getDiaryInfoByContent(input);
      const isValid = isEnglishOnly(result.content);

      console.log(JSON.stringify(result));
      if (!isValid)
        throw new Error('일기 영어 내용이 영어로 적혀져 있지 않음.');
    } catch (err) {
      console.warn(err);
      throw new BadRequestException(
        'GetDiaryInfoByContent Function cause error',
      );
    }
  });

  it('OPEN AI 가 사용자에 대한 대답을 한국어, 그리고 JSON문법으로 잘 하는지에 대한 테스트', async () => {
    const inputMessage =
      '아 오늘도 고생많았어. 진짜 오늘 고생많이했다고... 내가 일게써야하니까 질문리스트좀 여러개 만들어봐 한번에 답변해줄게.';

    const response = await sendMessageToAI(inputMessage);
    console.log(response);
  });
});
