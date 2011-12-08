{
  PrModel
  PrCollection
  PrCollectionView
  PrModelView
} = window.Prolepsis

class window.Category extends PrModel

class window.Categories extends PrCollection

  model : Category
  collection_name : 'categories'
  model_name : 'category'

class window.CategoryView extends PrModelView
  template_selector : '#category-template'
 
class window.CategoryCollectionView extends PrCollectionView
  template_selector : '#category-collection-template'
  modelView : CategoryView

