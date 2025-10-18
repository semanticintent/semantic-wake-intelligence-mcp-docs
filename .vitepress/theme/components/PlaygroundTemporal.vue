<script setup lang="ts">
import { ref, computed } from 'vue'
import { playgroundScenarios, type Scenario, type Message } from '../playground-data'

const selectedScenario = ref<Scenario | null>(null)
const currentMessageIndex = ref(0)
const isPlaying = ref(false)

const visibleMessages = computed(() => {
  if (!selectedScenario.value) return []
  return selectedScenario.value.messages.slice(0, currentMessageIndex.value + 1)
})

const canAdvance = computed(() => {
  if (!selectedScenario.value) return false
  return currentMessageIndex.value < selectedScenario.value.messages.length - 1
})

const canRestart = computed(() => {
  return currentMessageIndex.value > 0
})

function selectScenario(scenario: Scenario) {
  selectedScenario.value = scenario
  currentMessageIndex.value = 0
  isPlaying.value = false
}

function nextMessage() {
  if (canAdvance.value) {
    isPlaying.value = true
    setTimeout(() => {
      currentMessageIndex.value++
      isPlaying.value = false
    }, 300)
  }
}

function restart() {
  currentMessageIndex.value = 0
  isPlaying.value = false
}

function backToScenarios() {
  selectedScenario.value = null
  currentMessageIndex.value = 0
  isPlaying.value = false
}

function formatJSON(obj: any): string {
  return JSON.stringify(obj, null, 2)
}
</script>

<template>
  <div class="playground-container">
    <!-- Scenario Selection -->
    <div v-if="!selectedScenario" class="scenario-grid">
      <div class="playground-header">
        <h2>🎮 WakeIQX Playground</h2>
        <p>Experience 3-layer temporal intelligence with interactive scenarios</p>
        <div class="layer-badges">
          <span class="layer-badge layer-1">🔍 Layer 1: Past (WHY)</span>
          <span class="layer-badge layer-2">💾 Layer 2: Present (HOW)</span>
          <span class="layer-badge layer-3">🔮 Layer 3: Future (WHAT)</span>
        </div>
      </div>

      <div class="scenarios">
        <div
          v-for="scenario in playgroundScenarios"
          :key="scenario.id"
          class="scenario-card"
          @click="selectScenario(scenario)"
        >
          <div class="scenario-icon">{{ scenario.icon }}</div>
          <h3>{{ scenario.title }}</h3>
          <p>{{ scenario.description }}</p>
          <div class="scenario-footer">
            <span class="scenario-tag">{{ scenario.category }}</span>
            <span class="scenario-messages">{{ scenario.messages.length }} steps</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Conversation Player -->
    <div v-else class="conversation-player">
      <div class="player-header">
        <button class="back-button" @click="backToScenarios">
          ← Back to Scenarios
        </button>
        <div class="scenario-title">
          <span>{{ selectedScenario.icon }}</span>
          <h3>{{ selectedScenario.title }}</h3>
        </div>
        <div class="progress">
          Step {{ currentMessageIndex + 1 }} of {{ selectedScenario.messages.length }}
        </div>
      </div>

      <div class="messages-container">
        <div
          v-for="(message, index) in visibleMessages"
          :key="index"
          class="message"
          :class="[`message-${message.role}`, { 'message-entering': index === currentMessageIndex && isPlaying }]"
        >
          <!-- User Message -->
          <div v-if="message.role === 'user'" class="message-user">
            <div class="message-avatar">👤</div>
            <div class="message-content">
              <div class="message-label">You</div>
              <div class="message-text">{{ message.content }}</div>
            </div>
          </div>

          <!-- System Message -->
          <div v-else-if="message.role === 'system'" class="message-system">
            <div class="system-indicator">
              <span class="loading-spinner"></span>
              {{ message.content }}
            </div>
          </div>

          <!-- Tool Invocation -->
          <div v-else-if="message.role === 'tool' && message.toolName" class="message-tool">
            <div class="tool-invocation">
              <div class="tool-header">
                <span class="tool-icon">⚡</span>
                <strong>{{ message.content }}</strong>
              </div>
              <div class="tool-name">
                <code>{{ message.toolName }}</code>
              </div>
              <details class="tool-params">
                <summary>View Parameters</summary>
                <pre><code>{{ formatJSON(message.toolParams) }}</code></pre>
              </details>
            </div>
          </div>

          <!-- Tool Result -->
          <div v-else-if="message.role === 'tool' && message.toolResult" class="message-tool-result">
            <details class="tool-result-details">
              <summary>
                <span class="tool-result-icon">📊</span>
                <strong>{{ message.content }}</strong>
                <span class="expand-hint">(Click to expand)</span>
              </summary>
              <pre><code>{{ formatJSON(message.toolResult) }}</code></pre>
            </details>
          </div>

          <!-- Assistant Response -->
          <div v-else-if="message.role === 'assistant'" class="message-assistant">
            <div class="message-avatar">🐦</div>
            <div class="message-content">
              <div class="message-label">WakeIQX</div>
              <div class="message-text markdown-content" v-html="message.content.replace(/\n/g, '<br>')"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="player-controls">
        <button
          v-if="canRestart"
          class="control-button restart"
          @click="restart"
        >
          ↻ Restart
        </button>
        <button
          v-if="canAdvance"
          class="control-button next"
          @click="nextMessage"
          :disabled="isPlaying"
        >
          Next Step →
        </button>
        <div v-else class="completion-message">
          ✓ Scenario Complete
          <button class="control-button" @click="backToScenarios">
            Try Another →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.playground-header {
  text-align: center;
  margin-bottom: 3rem;
}

.playground-header h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-accent-1));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.playground-header p {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

.layer-badges {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.layer-badge {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s;
}

.layer-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--vp-c-brand-soft);
}

.layer-badge.layer-1 {
  border-color: #3b82f6;
  color: #3b82f6;
}

.layer-badge.layer-2 {
  border-color: #8b5cf6;
  color: #8b5cf6;
}

.layer-badge.layer-3 {
  border-color: #06b6d4;
  color: #06b6d4;
}

.scenarios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.scenario-card {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scenario-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px var(--vp-c-brand-soft);
}

.scenario-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  line-height: 1;
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
}

.scenario-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--vp-c-brand-1);
}

.scenario-card p {
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.scenario-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.scenario-tag {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-weight: 600;
}

.scenario-messages {
  color: var(--vp-c-text-3);
}

.conversation-player {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--vp-c-bg);
  border-bottom: 2px solid var(--vp-c-divider);
}

.back-button {
  background: none;
  border: none;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.back-button:hover {
  background: var(--vp-c-brand-soft);
}

.scenario-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.scenario-title span {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.scenario-title h3 {
  margin: 0;
  font-size: 1.125rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.progress {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

.messages-container {
  padding: 2rem 1.5rem;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
}

.message {
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-user, .message-assistant {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
}

.message-content {
  flex: 1;
}

.message-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.message-text {
  background: var(--vp-c-bg);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  line-height: 1.6;
}

.message-system {
  text-align: center;
  padding: 1rem;
}

.system-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-style: italic;
}

.loading-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid var(--vp-c-brand-soft);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear 3;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message-tool {
  padding: 1rem 0;
}

.tool-invocation {
  background: var(--vp-c-brand-soft);
  border-left: 4px solid var(--vp-c-brand-1);
  padding: 1rem;
  border-radius: 6px;
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tool-icon {
  font-size: 1.25rem;
}

.tool-name code {
  background: var(--vp-c-bg);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  color: var(--vp-c-brand-1);
}

.tool-params, .tool-result-details {
  margin-top: 0.75rem;
}

.tool-params summary, .tool-result-details summary {
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  user-select: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.tool-params summary:hover, .tool-result-details summary:hover {
  background: var(--vp-c-bg-soft);
}

.tool-params pre, .tool-result-details pre {
  margin-top: 0.5rem;
  background: var(--vp-c-bg);
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.8125rem;
}

.expand-hint {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.7;
}

.tool-result-icon {
  margin-right: 0.5rem;
}

.markdown-content {
  white-space: pre-wrap;
}

.player-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 1.5rem;
  background: var(--vp-c-bg);
  border-top: 2px solid var(--vp-c-divider);
}

.control-button {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.control-button:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-button.restart {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-divider);
}

.completion-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

@media (max-width: 768px) {
  .player-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .messages-container {
    max-height: 500px;
  }

  .layer-badges {
    flex-direction: column;
    align-items: center;
  }
}
</style>
