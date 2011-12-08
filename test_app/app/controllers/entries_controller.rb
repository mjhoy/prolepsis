class EntriesController < ApplicationController

  def index
    @project = Project.find_by_param!(params[:project_id])
    @entries = @project.entries

    respond_to do |format|
      format.json { render :json => @entries }
    end
  end

  def new
    @project = Project.find_by_param!(params[:project_id])
    @entry = @project.entries.build

    respond_to do |format|
      format.json { render :json => {
        :html => render_to_string(:partial => 'entries/form.html.haml' )
      } }
    end
  end

  def create
    @project = Project.find_by_param!(params[:project_id])
    @entry = @project.entries.build(params[:entry])

    respond_to do |format|
      if @entry.save
        format.json { render :json => @entry }
      else
        # error handling ...
      end
    end
  end

  def edit
    @project = Project.find_by_param!(params[:project_id])
    @entry = @project.entries.find(params[:id])
    respond_to do |format|
      format.json { render :json => {
        :html => render_to_string(:partial => 'entries/form.html.haml' )
      } }
    end
  end

  def update
    @project = Project.find_by_param!(params[:project_id])
    @entry = @project.entries.find(params[:id])
    respond_to do |format|
      if @entry.update_attributes(params[:entry])
        format.json { render :json => @entry }
      else
        # error handling ...
      end
    end
  end

  def destroy
    @project = Project.find_by_param!(params[:project_id])
    @entry = @project.entries.find(params[:id])
    @entry.destroy
    respond_to do |format|
      format.json { render :json => @entry }
    end
  end

  def sort
    project = Project.find_by_param!(params[:project_id])
    entries = project.entries
    entries.each do |e|
      e.position = params['entry'].index(e.id.to_s) + 1
      e.save
    end
    render :nothing => true
  end
end
