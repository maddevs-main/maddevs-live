const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    slug: String, // Ensure slug is in schema
    excerpt: String,
    author: String,
    date: String,
    content: String,
    imageUrl: String,
    detailImageUrl2: String,
    isPinned: Boolean,
    tags: [String], // Added tags field
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const blogs = [
  {
    id: 1,
    title: 'why design ',
    excerpt: `This is Lorem Ipsum, only typed by me so even navigating to elsewhere isn't worth it for this, i hope this fulfills the design requirements and your imagination necessities.`,
    author: 'Arjuna Dhananjaya',
    date: "12th May '25",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut laoreet ac sapien sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut laoreet ac sapien sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos.\n\nFaucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut laoreet ac sapien sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos.`,
    imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+1',
    detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Terra+Cota',
    isPinned: true,
    tags: ['design', 'updates'], // Example tags
  },
  {
    id: 2,
    title: 'intuitive tech',
    excerpt:
      'A deep dive into the stories painted on classical pottery, revealing tales of gods, heroes, and daily life from a bygone era.',
    author: 'Helena Troy',
    date: "10th May '25",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut laoreet ac sapien sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos.`,
    imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+2',
    detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Vase+Detail',
    isPinned: true,
    tags: ['art', 'history'],
  },
  {
    id: 3,
    title: 'The Symposium in Art',
    excerpt:
      'Analyzing the depiction of social gatherings and philosophical discussions on ancient Greek kraters and kylixes.',
    author: 'Socrates Jr.',
    date: "8th May '25",
    content: `This is a detailed exploration of symposium scenes in art. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.`,
    imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+3',
    detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Symposium+Art',
    isPinned: false,
    tags: ['art', 'philosophy'],
  },
  {
    id: 4,
    title: 'Mythological Creatures',
    excerpt:
      'From the Minotaur to the Hydra, a look at the fantastical beasts that adorned ancient pottery and their symbolic meanings.',
    author: 'Perseus Jackson',
    date: "5th May '25",
    content: `Myths and legends come to life on these ancient artifacts. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.`,
    imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+4',
    detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Creature+Detail',
    isPinned: false,
    tags: ['mythology', 'art'],
  },
  {
    id: 5,
    title: 'The Craft of Black-Figure Pottery',
    excerpt:
      'Understanding the intricate techniques used by artisans to create the iconic black-figure style of vase painting.',
    author: 'Athena Craftswoman',
    date: "2nd May '25",
    content:
      'The technique is fascinating. You start with the clay shape, then apply a slip that turns black during firing... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
    imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+5',
    detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Pottery+Craft',
    isPinned: true,
    tags: ['art', 'craft'],
  },
  {
    id: 6,
    title: 'Daily Life in Ancient Greece',
    excerpt:
      'Pottery provides a unique window into the everyday activities, clothing, and customs of the ancient world.',
    author: 'Historian Maximus',
    date: "1st May '25",
    content:
      'From weaving to warfare, the scenes offer invaluable insights. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.',
    imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+6',
    detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Daily+Life',
    isPinned: false,
    tags: ['history', 'daily life'],
  },
].map(blog => ({ ...blog, slug: slugify(blog.title) }));

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maddevs-og', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Blog.deleteMany({});
  await Blog.insertMany(blogs);
  console.log('Seeded blogs!');
  await mongoose.disconnect();
}

seed();
