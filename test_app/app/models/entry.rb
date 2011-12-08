class Entry < ActiveRecord::Base
  belongs_to :project
  acts_as_list :scope => :project
  default_scope order('position ASC')

  def as_json(options = {})
    {
      :id => self.id,
      :title => escape(self.title),
      :thought => escape(self.thought),
      :project_id => self.project_id,
    }
  end

  private

  def escape(s)
    ERB::Util.html_escape(s)
  end
end
