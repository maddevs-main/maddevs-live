const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    slug: String, // Ensure slug is in schema
    subtitle: String,
    imageUrl: String,
    content: String,
    layout: String,
    tags: [String],
  },
  { timestamps: true }
);

const News = mongoose.model('News', newsSchema);

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const news = [
  {
    id: 1,
    title: 'launch',
    subtitle: 'cooking something great',
    imageUrl: 'https://placehold.co/600x400/D2691E/000000?text=TERRA+COTTA',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien, vitae pellentesque sem placerat. In id cursus mi, pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra, inceptos himenaeos. \n\n Vivamus dictum magna vitae sem egestas, ac varius nisl venenatis. Donec et eleifend ex, non aliquam quam. Praesent ac magna sit amet sem scelerisque tristique. Cras commodo, elit a lacinia commodo, est magna malesuada est, et laoreet ex nibh non lectus.',
    layout: 'image-top',
    tags: ['design', 'updates'],
  },
  {
    id: 2,
    title: 'NEWS POST',
    subtitle: 'exploring ancient forms',
    imageUrl: 'https://placehold.co/600x400/D2691E/000000?text=ART',
    content:
      'Suspendisse potenti. Nullam in erat ut lectus feugiat pulvinar. Proin non elit eget odio feugiat eleifend. Sed eu magna sed justo ullamcorper feugiat. Integer in nisi vel justo consequat lacinia. Duis in porta justo, a volutpat sem. Curabitur vitae nisi vel sem bibendum ultrices. \n\n Nam sit amet nunc nec turpis viverra fermentum. Sed eu facilisis turpis. Nulla facilisi. Praesent nec egestas erat, et facilisis massa. Donec id libero at dolor tincidunt faucibus. Fusce vitae lorem eu justo aliquam egestas. Maecenas sed odio sit amet elit consequat consequat.',
    layout: 'image-right',
    tags: ['products'],
  },
  {
    id: 3,
    title: 'TERRA COTTA PLAGUE NEWS POST',
    subtitle: 'a study in black and orange',
    imageUrl: 'https://placehold.co/600x400/D2691E/000000?text=ANCIENT+LIFE',
    content:
      'Aenean euismod, nisl eget ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Sed euismod, nisl eget ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. \n\n Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.',
    layout: 'image-left',
    tags: ['design'],
  },
  {
    id: 4,
    title: 'THE LATEST DISCOVERIES',
    subtitle: 'unearthing the past',
    imageUrl: 'https://placehold.co/600x400/D2691E/000000?text=HISTORY',
    content:
      'Cras et libero eu ex feugiat tristique. Sed et justo non est condimentum ultrices. Nullam nec libero nec justo aliquam tincidunt. Sed nec nunc et justo consequat eleifend. \n\n Ut fringilla, justo a ultricies aliquam, nunc nunc tincidunt nunc, id lacinia nunc nunc nec nunc. Vivamus nec nunc nec nunc ultricies aliquam. Donec nec nunc nec nunc ultricies aliquam. Fusce nec nunc nec nunc ultricies aliquam.',
    layout: 'image-top',
    tags: ['updates'],
  },
  {
    id: 5,
    title: 'ANCIENT CIVILIZATIONS',
    subtitle: 'stories etched in clay',
    imageUrl: 'https://placehold.co/600x400/D2691E/000000?text=CULTURE',
    content:
      'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. \n\n Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
    layout: 'image-right',
    tags: ['products', 'design'],
  },
].map(n => ({ ...n, slug: slugify(n.title) }));

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maddevs-og', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await News.deleteMany({});
  await News.insertMany(news);
  console.log('Seeded news!');
  await mongoose.disconnect();
}

seed();
