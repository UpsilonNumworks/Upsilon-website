<template>
  <div>
    <div class="doc-wrapper">
      <div class="doc">
        <h1>{{ t('help.name') }}</h1>
        <h2
          v-if="questionText"
          v-html="questionText"
        ></h2>
        <!-- Div to store answers -->
        <div>
          <div v-for="(item, index) in answers" :key="index">
            <!-- Show the key name of the item by the index -->
            <button @click="selectAnswer(item)">{{ t(item.askNow) }}</button>
          </div>
        </div>
        <h2>{{ t('help.solution') }}</h2>
                <div
          v-if="solutionText"
          v-html="solutionText"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'Help',
  components: { },
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'local'
    })
    return { t }
  },
  data () {
    return {
      questionText: '',
      solutionText: '',
      answers: [],
      questions: {
        'help.what-problem': {
          response: 'help.continue',
          question: 'help.what-problem',
          answers: {
            'help.wont-boot': {
              response: 'help.continue',
              question: 'help.led-status',
              answers: {
                'help.led-off': {
                  question: 'help.press-reset',
                  answers: {
                    'help.reset-success': {
                      response: 'help.end'
                    },
                    'help.reset-fail': {
                    }
                  },
                  response: 'help.continue'
                },
                'help.led-red': {
                }
              }
            }
          }
        }
      }
    }
  },
  mounted: function () {
    this.onload()
  },
  methods: {
    onload: function () {
      console.log('onload')
      this.actualQuestion = this.questions['help.what-problem']
      this.askQuestion()
    },
    showResponses (question) {
      this.answers = {}
      for (const answer in question.answers) {
        // Add the answer to the answers object
        this.answers[answer] = question.answers[answer]
        // Add the question to ask now (askNow) to the answers object
        this.answers[answer].askNow = answer
      }
    },
    showSolution (question) {
      this.solutionText = this.t(question.response)
    },
    askQuestion () {
      // Get the first object in the actualQuestion object
      // const question = this.actualQuestion[Object.keys(this.actualQuestion)[0]]
      // Get the key of the question
      // const questionKey = Object.keys(this.actualQuestion)[0]
      // Set the question text translated
      this.questionText = this.t(this.actualQuestion.question)
      // Show the responses
      this.showResponses(this.actualQuestion)
      // Show the solution
      this.showSolution(this.actualQuestion)
    },
    selectAnswer (answer) {
      console.log(answer)
      // Remove the question text
      this.questionText = ''
      // If the answer has a question, ask it
      if (answer.question) {
        console.log('Subtree is a question')
        // Set the next question to ask
        this.actualQuestion = answer
        // Ask the question
        this.askQuestion()
      } else {
        // Remove answers by setting it to false because an empty list doesn't trigger the v-if
        this.answers = false
        // If the answer has a response, show it
        if (answer.response) {
          console.log('Subtree is only a response')
          // Show the solution
          this.showSolution(answer)
        // Else, show the non implemented message
        } else {
          console.log('Subtree is empty')
          this.solutionText = this.t('help.not-implemented')
        }
      }
    }
  }
})
</script>

<style scoped>
.proposedAnswer {
  font-size: 20em;
}
</style>
