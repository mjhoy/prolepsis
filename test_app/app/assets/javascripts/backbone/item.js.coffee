{
  PrModel
  PrCollection
  PrCollectionView
  PrModelView
} = window.Prolepsis

class window.Item extends PrModel

class window.Items extends PrCollection

  model : Item
  belongs_to : 'projects'
  collection_name : 'items'
  model_name : 'item'

class window.ItemView extends PrModelView
  template_selector : '#item-template'

  # Used in the index view of items when editing a project.
  # If the item does not have a title, provide some helpful
  # information.
  edit_title : ->
    title = @model.get('title')
    if title and title.length
      title
    else
      filename = @model.get('image_file_name')
      "<em>[untitled]</em> " + 
        "<span class='filename'>" +
          filename +
        "</span>"

  # Override the standard render function to
  # augment the JSON object being rendered.
  render : =>
    json = _.extend(@model.toJSON(), { edit_title : @edit_title() })
    ($ @el).html(@template(json))
    this

 
class window.ItemCollectionView extends PrCollectionView
  template_selector : '#item-collection-template'
  modelView : ItemView
