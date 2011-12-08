module ApplicationHelper
  def is_active?(page)
    if page.to_s.match controller.action_name
      "active"
    else
      nil
    end
  end

  def body_class
    controller.controller_name
  end

  def content_class
    controller.action_name
  end
end
