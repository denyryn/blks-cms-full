export default function flatten(data, fallback) {
  Object.values(data).flat().join(", ") || fallback;
}
