class Project < ActiveRecord::Base
  has_many :entries, 
    :dependent => :destroy,
    :order => "position ASC"

  acts_as_list

  default_scope order('position ASC')

  validates :permalink, :name, :presence => true
  validates :permalink, :uniqueness => true

  before_validation :set_permalink, :on => :create

  def to_param
    permalink
  end

  def self.find_by_param!(param)
    self.find_by_permalink!(param)
  end

  def as_json(opts = {})
    {
      :id => id,
      :name => escape(name),
      :created_at => created_at,
      :updated_at => updated_at,
      :permalink => permalink,
      :param => to_param,
    }
  end

  private

  def set_permalink
    self.permalink = (name || '').parameterize if permalink.blank?
  end

  def escape(s)
    ERB::Util.html_escape(s)
  end
end
