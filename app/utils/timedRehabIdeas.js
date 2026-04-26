import Shuffled from './shuffled.js'

const defaultRehabPlanRefs = {
  morning: {
    miniBreakIdeas: ['abz', 'aca', 'acb', 'acc', 'acd'],
    longBreakIdeas: ['abk', 'abl', 'abm', 'abn']
  },
  midday: {
    miniBreakIdeas: ['ace', 'acf', 'acg'],
    longBreakIdeas: ['abo', 'abp', 'abq', 'abr']
  },
  evening: {
    miniBreakIdeas: ['aca', 'ace', 'acf', 'acg', 'abo'],
    longBreakIdeas: ['abs', 'abt']
  }
}

function defaultRehabIdeaGroups (t) {
  return Object.fromEntries(Object.entries(defaultRehabPlanRefs).map(([slot, ideas]) => {
    return [slot, {
      miniBreakIdeas: ideas.miniBreakIdeas.map(key => t(`miniBreakIdeas.${key}.text`)),
      longBreakIdeas: ideas.longBreakIdeas.map(key => ({
        title: t(`longBreakIdeas.${key}.title`),
        text: t(`longBreakIdeas.${key}.text`)
      }))
    }]
  }))
}

function rehabPlanSlotForDate (date = new Date()) {
  const hour = date.getHours()

  if (hour >= 5 && hour < 12) {
    return 'morning'
  }

  if (hour >= 12 && hour < 18) {
    return 'midday'
  }

  return 'evening'
}

function normalizeRehabIdeaGroups (groups, t) {
  const defaultGroups = defaultRehabIdeaGroups(t)
  const source = groups && typeof groups === 'object' ? groups : defaultGroups

  return Object.fromEntries(Object.keys(defaultGroups).map(slot => {
    const sourceSlot = source[slot] && typeof source[slot] === 'object' ? source[slot] : defaultGroups[slot]
    const miniBreakIdeas = Array.isArray(sourceSlot.miniBreakIdeas)
      ? sourceSlot.miniBreakIdeas.filter(item => typeof item === 'string' && item.trim())
      : defaultGroups[slot].miniBreakIdeas
    const longBreakIdeas = Array.isArray(sourceSlot.longBreakIdeas)
      ? sourceSlot.longBreakIdeas
        .filter(item => item && typeof item.title === 'string' && typeof item.text === 'string' && item.title.trim() && item.text.trim())
        .map(item => ({ title: item.title, text: item.text }))
      : defaultGroups[slot].longBreakIdeas

    return [slot, {
      miniBreakIdeas: miniBreakIdeas.length > 0 ? miniBreakIdeas : defaultGroups[slot].miniBreakIdeas,
      longBreakIdeas: longBreakIdeas.length > 0 ? longBreakIdeas : defaultGroups[slot].longBreakIdeas
    }]
  }))
}

function buildTimedRehabIdeas (groups, type) {
  return Object.fromEntries(Object.entries(groups).map(([slot, ideas]) => {
    const slotIdeas = type === 'miniBreakIdeas'
      ? ideas.miniBreakIdeas
      : ideas.longBreakIdeas.map(idea => [idea.title, idea.text])

    return [slot, new Shuffled(slotIdeas)]
  }))
}

class TimedRehabIdeas {
  constructor (ideasBySlot, dateProvider = () => new Date()) {
    this.ideasBySlot = ideasBySlot
    this.dateProvider = dateProvider
  }

  get randomElement () {
    const slot = rehabPlanSlotForDate(this.dateProvider())
    return this.ideasBySlot[slot].randomElement
  }
}

function createTimedRehabIdeas (t, groups) {
  const normalizedGroups = normalizeRehabIdeaGroups(groups, t)

  return {
    microbreakIdeas: new TimedRehabIdeas(buildTimedRehabIdeas(normalizedGroups, 'miniBreakIdeas')),
    breakIdeas: new TimedRehabIdeas(buildTimedRehabIdeas(normalizedGroups, 'longBreakIdeas')),
    groups: normalizedGroups
  }
}

export {
  createTimedRehabIdeas,
  defaultRehabIdeaGroups,
  normalizeRehabIdeaGroups,
  rehabPlanSlotForDate
}
