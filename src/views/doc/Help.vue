<template>
  <div>
    <div class="doc-wrapper">
      <div class="doc">
        <h1>{{ t("help.name") }}</h1>
        <h2 id="question" v-if="questionText != ''" v-html="questionText"></h2>
        <!-- Div to store answers -->
        <div v-if="answers" class="questions">
          <!-- Show the key name of the item by the index -->
          <TransitionGroup name="fade"
            ><button
              v-for="(item, index) in answers"
              :key="index"
              @click="selectAnswer(item)"
            >
              {{ t(item.askNow) }}
            </button></TransitionGroup
          >
        </div>
        <TransitionGroup name="fade">
          <h2 v-if="solutionText != undefined">{{ t("help.solution") }}</h2>
          <div v-if="solutionText != undefined" v-html="solutionText"></div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'Help',
  components: {},
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
        answers: {
          'help.what-problem': {
            question: 'help.what-problem',
            answers: {
              'help.wont-boot': {
                question: 'help.press-reset',
                answers: {
                  'help.reset-success': {
                    solution: 'help.end'
                  },
                  'help.reset-fail': {
                    redirect: 'help.recovery'
                  }
                }
              },
              'help.n????': {
                redirect: 'help.recovery'
              },
              'help.cant-detect': {
                question: 'help.do-you-have-driver',
                answers: {
                  'help.have-driver': {

                  },
                  'help.no-driver': {
                    solution: 'help.install-driver'
                  }
                }
              }
            }
          },
          'help.recovery': {
            hidden: false,
            question: 'help.reset6',
            answers: {
              'help.next': {
                question: 'help.recovery',
                answers: {
                  'help.recovery-success': {
                    solution: 'help.install-os'
                  },
                  'help.recovery-fail': {
                  }
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
    log (text) {
      // In debug mode, log the text
      if (process.env.NODE_ENV !== 'production') {
        console.log(text)
      }
    },
    onload: function () {
      this.log('onload')
      this.selectAnswer(this.questions.answers['help.what-problem'])
    },
    showResponses (question) {
      this.answers = {}
      for (const answer in question.answers) {
        // Get the answer
        const answerItem = question.answers[answer]
        // If the answer is hidden, don't show it
        if (answerItem.hidden) {
          continue
        }
        // Add the answer to the answers object
        this.answers[answer] = answerItem
        // Add the question to ask now (askNow) to the answers object
        this.answers[answer].askNow = answer
      }
    },
    showSolution (question) {
      if (question.solution === undefined) {
        this.solutionText = undefined
      } else {
        this.solutionText = this.t(question.solution)
      }
    },
    askQuestion () {
      // Set the question text translated
      this.questionText = this.t(this.actualQuestion.question)
      // Show the responses
      this.showResponses(this.actualQuestion)
      // Show the solution
      this.showSolution(this.actualQuestion)
    },
    selectAnswer (answer) {
      // Remove the question text
      this.questionText = ''
      // Get if a redirect is needed
      if (answer.redirect !== undefined) {
        // Redirect to the new question
        this.redirect(answer.redirect)
      // If the answer has a question, ask it
      } else if (answer.question) {
        this.log('Subtree is a question')
        // Set the next question to ask
        this.actualQuestion = answer
        // Ask the question
        this.askQuestion()
      } else {
        // Remove answers by setting it to false because an empty list doesn't trigger the v-if
        this.answers = false
        // If the answer has a solution, show it
        if (answer.solution) {
          this.log('Subtree is only a solution')
          // Show the solution
          this.showSolution(answer)
          // Else, show the non implemented message
        } else {
          this.log('Subtree is empty')
          this.solutionText = this.t('help.not-implemented')
        }
      }
    },
    redirect (path) {
      // Log the redirect
      this.log('Redirecting to ' + path)
      // Split the path by /
      const pathArray = path.split('/')
      // Initialise the path to redirect to
      let pathToRedirect = this.questions
      // For each path, get the object in the path
      for (const pathItem of pathArray) {
        // Log the path
        pathToRedirect = pathToRedirect.answers[pathItem]
      }
      // Unhide the question
      pathToRedirect.hidden = false
      // Select the answer
      this.selectAnswer(pathToRedirect)
    }
  }
})
</script>

<style scoped>
.proposedAnswer {
  font-size: 20em;
}
button {
  flex: 1;
  display: block;
}
.questions {
  display: flex;
}
.fade-enter-active {
  transition: all 0.5s ease;
}
.fade-leave-active {
  transition: all 0.5s ease;
  display: none;
}
.fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}
h2#question{
  font-family:Lato;
  font-size: 1.5em;
}
</style>
