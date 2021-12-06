export default {
  Taxonomy: {
    children: (edge) => edge.depth === 1,
  },
  WebsiteSection: {
    children: (edge) => edge.depth === 1,
  },
};
