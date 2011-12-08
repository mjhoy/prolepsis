{
  Model
  Collection
  CollectionView
  ModelView
} = window.Prolepsis

class window.Project extends Model

class window.Projects extends Collection

  model : Project
  collectionName : 'projects'
  modelName : 'project'

class window.ProjectView extends ModelView
  templateSelector : '#project-template'
  disable : [ 'edit' ]
 
class window.ProjectCollectionView extends CollectionView
  templateSelector : '#project-collection-template'
  modelView : ProjectView

class window.Entry extends Model

class window.Entries extends Collection
  model : Entry
  belongsTo : 'projects'
  collectionName : 'entries'
  modelName : 'entry'

class window.EntryView extends ModelView
  templateSelector : '#entry-template'

class window.EntryCollectionView extends CollectionView
  templateSelector : '#project-entries-collection-template'
  modelView : EntryView
