
$ ->

  if ($ '#projects-container').length
    projects = window.projects = new Projects
    projectsCollectionView = new ProjectCollectionView({collection: projects})
    ($ '#projects-container').append projectsCollectionView.render().el
    projects.fetch()

  if ($ '#project-entries-container').length
    entries = window.entries = new Entries
    entryCollectionView = new EntryCollectionView({collection: entries})
    ($ '#project-entries-container').append entryCollectionView.render().el
    entries.fetch()
