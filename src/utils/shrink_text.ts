
const shrink_text = (text?: string, threshold?: number, size?: number) => {
  if (!text || !threshold || !size) return {}
  console.log('shrink_text', text, threshold, size)
  return text.length > threshold ? { size } : {}
}
export default shrink_text