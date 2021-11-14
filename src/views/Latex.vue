<template>
  <div class="doc-wrapper">
    <div class="doc">
      <h2>{{ t('doc.latex.reference') }}</h2>
      <p>
        {{ t('doc.latex.description') }}
      </p>
      <p>
        {{ t('doc.latex.symbolslisted') }}
      </p>
      <div id="latex-tables">
        <table>
          <thead>
            <tr>
              <th>{{ t('doc.latex.command') }}</th>
              <th>{{ t('doc.latex.output') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>\frac{ab}{cd}</code></td>
              <td>$\frac{ab}{cd}$</td>
            </tr>
            <tr>
              <td><code>\sqrt[n]{x}</code></td>
              <td>$\sqrt[n]{x}$</td>
            </tr>
          </tbody>
        </table>
        <div class="latex-table">
          <p>{{ t('doc.latex.mathsymbols') }}</p>
          <table>
            <thead>
              <tr>
                <th>{{ t('doc.latex.command') }}</th>
                <th>{{ t('doc.latex.output') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>\times</code></td>
                <td>×</td>
              </tr>
              <tr>
                <td><code>\div</code></td>
                <td>÷</td>
              </tr>
              <tr>
                <td><code>\forall</code></td>
                <td>∀</td>
              </tr>
              <tr>
                <td><code>\exists</code></td>
                <td>∃</td>
              </tr>
              <tr>
                <td><code>\partial</code></td>
                <td>∂</td>
              </tr>
              <tr>
                <td><code>\pm</code></td>
                <td>±</td>
              </tr>
              <tr>
                <td><code>\infty</code></td>
                <td>∞</td>
              </tr>
              <tr>
                <td><code>\approx</code></td>
                <td>≈</td>
              </tr>
              <tr>
                <td><code>\neq</code></td>
                <td></td>
              </tr>
              <tr>
                <td><code>\equiv</code></td>
                <td>≡</td>
              </tr>
              <tr>
                <td><code>\leq</code></td>
                <td>≤</td>
              </tr>
              <tr>
                <td><code>\geq</code></td>
                <td>≥</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="latex-table">
          <p>{{ t('doc.latex.doublearrow') }}</p>
          <table>
            <thead>
              <tr>
                <th>{{ t('doc.latex.command') }}</th>
                <th>{{ t('doc.latex.output') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>\Leftarrow</code></td>
                <td>⇐</td>
              </tr>
              <tr>
                <td><code>\Rightarrow</code></td>
                <td>⇒</td>
              </tr>
              <tr>
                <td><code>\Uparrow</code></td>
                <td>⇑</td>
              </tr>
              <tr>
                <td><code>\Downarrow</code></td>
                <td>⇓</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="latex-table">
          <p>{{ t('doc.latex.simplearrow') }}</p>
          <table>
            <thead>
              <tr>
                <th>{{ t('doc.latex.command') }}</th>
                <th>{{ t('doc.latex.output') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>\leftarrow</code></td>
                <td>←</td>
              </tr>
              <tr>
                <td><code>\rightarrow</code></td>
                <td>→</td>
              </tr>
              <tr>
                <td><code>\uparrow</code></td>
                <td>↑</td>
              </tr>
              <tr>
                <td><code>\downarrow</code></td>
                <td>↓</td>
              </tr>
              <tr>
                <td><code>\leftrightarrow</code></td>
                <td>↔</td>
              </tr>
              <tr>
                <td><code>\updownarrow</code></td>
                <td>↕</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="latex-table">
          <p>{{ t('doc.latex.greekcapitalletter') }}</p>
          <table>
            <thead>
              <tr>
                <th>{{ t('doc.latex.command') }}</th>
                <th>{{ t('doc.latex.output') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>\Alpha</code></td>
                <td>A</td>
              </tr>
              <tr>
                <td><code>\Beta</code></td>
                <td>B</td>
              </tr>
              <tr>
                <td><code>\Gamma</code></td>
                <td>Γ</td>
              </tr>
              <tr>
                <td><code>\Delta</code></td>
                <td>Δ</td>
              </tr>
              <tr>
                <td><code>\Epsilon</code></td>
                <td>E</td>
              </tr>
              <tr>
                <td><code>\Zeta</code></td>
                <td>Z</td>
              </tr>
              <tr>
                <td><code>\Eta</code></td>
                <td>H</td>
              </tr>
              <tr>
                <td><code>\Theta</code></td>
                <td>Θ</td>
              </tr>
              <tr>
                <td><code>\Iota</code></td>
                <td>I</td>
              </tr>
              <tr>
                <td><code>\Kappa</code></td>
                <td>K</td>
              </tr>
              <tr>
                <td><code>\Lambda</code></td>
                <td>Λ</td>
              </tr>
              <tr>
                <td><code>\Mu</code></td>
                <td>M</td>
              </tr>
              <tr>
                <td><code>\Nu</code></td>
                <td>N</td>
              </tr>
              <tr>
                <td><code>\Xi</code></td>
                <td>Ξ</td>
              </tr>
              <tr>
                <td><code>\Omicron</code></td>
                <td>O</td>
              </tr>
              <tr>
                <td><code>\Pi</code></td>
                <td>Π</td>
              </tr>
              <tr>
                <td><code>\Rho</code></td>
                <td>P</td>
              </tr>
              <tr>
                <td><code>\Sigma</code></td>
                <td>Σ</td>
              </tr>
              <tr>
                <td><code>\Tau</code></td>
                <td>T</td>
              </tr>
              <tr>
                <td><code>\Upsilon</code></td>
                <td>Υ</td>
              </tr>
              <tr>
                <td><code>\Phi</code></td>
                <td>Φ</td>
              </tr>
              <tr>
                <td><code>\Chi</code></td>
                <td>X</td>
              </tr>
              <tr>
                <td><code>\Psi</code></td>
                <td>Ψ</td>
              </tr>
              <tr>
                <td><code>\Omega</code></td>
                <td>Ω</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="latex-table">
          <p>{{ t('doc.latex.greeksmallletter') }}</p>
          <table>
            <thead>
              <tr>
                <th>{{ t('doc.latex.command') }}</th>
                <th>{{ t('doc.latex.output') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>\alpha</code></td>
                <td>α</td>
              </tr>
              <tr>
                <td><code>\beta</code></td>
                <td>β</td>
              </tr>
              <tr>
                <td><code>\gamma</code></td>
                <td>γ</td>
              </tr>
              <tr>
                <td><code>\delta</code></td>
                <td>δ</td>
              </tr>
              <tr>
                <td><code>\epsilon</code></td>
                <td>ϵ</td>
              </tr>
              <tr>
                <td><code>\zeta</code></td>
                <td>ζ</td>
              </tr>
              <tr>
                <td><code>\eta</code></td>
                <td>η</td>
              </tr>
              <tr>
                <td><code>\theta</code></td>
                <td>θ</td>
              </tr>
              <tr>
                <td><code>\iota</code></td>
                <td>ι</td>
              </tr>
              <tr>
                <td><code>\kappa</code></td>
                <td>κ</td>
              </tr>
              <tr>
                <td><code>\lambda</code></td>
                <td>λ</td>
              </tr>
              <tr>
                <td><code>\mu</code></td>
                <td>μ</td>
              </tr>
              <tr>
                <td><code>\nu</code></td>
                <td>ν</td>
              </tr>
              <tr>
                <td><code>\xi</code></td>
                <td>ξ</td>
              </tr>
              <tr>
                <td><code>\pi</code></td>
                <td>π</td>
              </tr>
              <tr>
                <td><code>\rho</code></td>
                <td>ρ</td>
              </tr>
              <tr>
                <td><code>\sigma</code></td>
                <td>σ</td>
              </tr>
              <tr>
                <td><code>\tau</code></td>
                <td>τ</td>
              </tr>
              <tr>
                <td><code>\upsilon</code></td>
                <td>υ</td>
              </tr>
              <tr>
                <td><code>\phi</code></td>
                <td>ϕ</td>
              </tr>
              <tr>
                <td><code>\chi</code></td>
                <td>χ</td>
              </tr>
              <tr>
                <td><code>\psi</code></td>
                <td>ψ</td>
              </tr>
              <tr>
                <td><code>\omega</code></td>
                <td>ω</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: '',
  setup () {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    return { t }
  }
})
</script>

<style scoped>
#latex-tables {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.latex-table {
  margin: 30px;
  background: #ffffff20;
  border: solid lightgrey 2pt;
  border-radius: 15px;
  padding: 15px;
}
.latex-table > p {
  margin-top: 0;
}
</style>
