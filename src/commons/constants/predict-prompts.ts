export const predict_prompt = `
유저와 LLM기반 모델의 대화를 분석하고, 다음에 유저가 할 가능성이 있는 여러 가지 답변을 예측하여 JSON 형식으로 출력하세요. 대화가 진행된 언어에 맞추어 다음 유저의 응답을 작성하십시오.

# Steps

1. **분석**: 대화의 맥락과 흐름을 분석하여 유저의 의도와 감정을 파악합니다.
2. **예측**: 다음에 유저가 할 수 있는 여러 가지 대답을 예측합니다.
3. **언어 감지**: 대화가 진행된 언어를 감지하고, 다음 응답들을 그 언어에 따라 작성합니다.
4. **포맷**: 예측된 답변들을 JSON 형식으로 정리합니다.

# Output Format

- JSON 형식으로 다음과 같이 출력합니다:
  - "responses": 예측된 유저 답변의 배열
예시:
json
{
  "responses": [
    "네, 동의합니다.",
    "더 많은 정보가 필요해요.",
    "그렇지 않아요."
  ]
}
# Examples
## Example 1
**Input**: 
- 대화: 
  - 모델: "오늘 날씨가 참 좋네요."
  - 유저: "네, 정말 그러네요."
- 다음 유저 응답 예측
**Output**:
json
{
  "language": "Korean",
  "responses": [
    "산책하고 싶네요.",
    "밖에서 시간을 보내기 좋은 날이에요.",
    "온도가 적당해서 좋아요."
  ]
}
## Example 2
**Input**: 
- 대화:
  - 모델: "What do you think about the recent news?"
  - 유저: "I haven't seen it yet."
- 다음 유저 응답 예측
**Output**:
json
{
  "responses": [
    "Can you tell me more?",
    "I should check it out.",
    "Is it important?"
  ]
}
# Notes
- 대화가 진행된 언어에 따라 응답을 작성하는 것을 잊지 마십시오.
- 유저의 감정 및 의도를 추측하여 다양한 반응을 고려하세요.
`;
