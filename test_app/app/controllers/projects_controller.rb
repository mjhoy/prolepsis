class ProjectsController < ApplicationController

  def index
    @projects = Project.all
    respond_to do |format|
      format.html
      format.json { render :json => @projects }
    end
  end

  def new
    @project = Project.new
    respond_to do |format|
      format.json { render :json => {
        :object => @project,
        :html   => render_to_string(:partial => 'projects/form.html.haml', :locals => { :project => @project }),
        :action => 'new',
        :kind   => 'project'
      } }
    end
  end

  def create
    @project = Project.create(params[:project])
    respond_to do |format|
      if @project.save
        format.html { redirect_to projects_path }
      else
        format.html { render 'new' }
      end
    end
  end

  def update
    @project = Project.find_by_param!(params[:id])
    respond_to do |format|
      if @project.update_attributes(params[:project])
        format.html { redirect_to edit_project_url(@project) }
      else
        format.html { render 'edit' }
      end
    end
  end

  def edit
    @project = Project.find_by_param!(params[:id])
  end

  def show
    @project = Project.find_by_param!(params[:id])
  end

  def destroy
    @project = Project.find_by_param!(params[:id])
    @project.destroy
    respond_to do |format|
      format.html { redirect_to projects_url }
      format.json { render :json => @project }
    end
  end

  def sort
    project = Project.all
    project.each do |p|
      p.position = params['project'].index(p.id.to_s) + 1
      p.save
    end
    render :nothing => true
  end
end
