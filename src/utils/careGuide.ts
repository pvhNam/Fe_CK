export type CareStep = {
    label: string
    text: string
}

export function parseCareGuide(careGuide: string): CareStep[] {
    const steps: CareStep[] = []

    const sentences = careGuide.split('. ')

    for (const raw of sentences) {
        const sentence = raw.trim().replace(/\.$/, '')
        if (sentence === '') continue

        const colon = sentence.indexOf(':')
        const isNewStep = colon > 0 && colon <= 20
        const lastStep = steps[steps.length - 1]

        if (isNewStep) {
            steps.push({
                label: sentence.slice(0, colon).trim(),
                text: sentence.slice(colon + 1).trim(),
            })
        } else if (lastStep) {
            lastStep.text += '. ' + sentence
        } else {
            steps.push({ label: '', text: sentence })
        }
    }

    return steps
}