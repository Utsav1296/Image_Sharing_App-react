import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = sanityClient({
    projectId: import.meta.env.VITE_REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2022-11-12', // use a UTC date string
    token: import.meta.env.VITE_REACT_APP_SANITY_TOKEN, // or leave blank for unauthenticated usage
    ignoreBrowserTokenWarning: true,
    useCdn: true, // `false` if you want to ensure fresh data

})

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source)