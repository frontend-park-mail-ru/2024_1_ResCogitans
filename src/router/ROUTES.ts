export const ROUTES = {
  root: '/',
  journey: {
    edit : (journeyId?: string | number) => (journeyId ? `/journey/${journeyId}/edit` : '/journey/:journeyId/edit'),
    view : (journeyId?: string | number) => (journeyId ? `/journey/${journeyId}` : '/journey/:journeyId'),
    create: 'trip/create',
  },
  sights : {
    view: (sightID?: string | number) => (sightID ? `/sights/${sightID}` : '/sights/:sightID'),
    
    editComment: (sightID?: string | number, commentID?: string | number) => (sightID ? `sight/${sightID}/edit/${commentID}` : 'sight/:sightID/edit/:commentID'),
    deleteComment: (sightID?: string | number, commentID?: string | number) => (sightID ? `sight/${sightID}/delete/${commentID}` : 'sight/:sightID/delete/:commentID'),
    createComment: (sightID?: string | number) => (sightID ? `sight/${sightID}/create` : 'sight/:sightID/create'),
  },
  profile: {
    view: (userID?: string | number) => (userID ? `/profile/${userID}` : '/profile/:userID'),
    edit: (userID?: string | number) => (userID ? `profile/${userID}/edit` : '/profile/:userID/edit'),
    reset_password: (userID?: string | number) => (userID ? `profile/${userID}/reset_password` : '/profile/:userID/reset_password'),
    upload: (userID?: string | number) => (userID ? `profile/${userID}/upload` : '/profile/:userID/upload'),
  },
};
