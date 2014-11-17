class API::V1::ListsController < ApplicationController

  # GET /lists
  def index

    @lists = List.all
    render json: @lists


  end

  # GET /lists/1
  def show

    @list = List.find(params[:id])
    render json: @list

  end

  # POST /list
  def create

    f = RestFirebase.new :site => 'https://sizzling-heat-3224.firebaseio.com/',
                         :secret => 'Zsk3zqULeFrenlV1D3FUObLuyuuuy7o7igx7IP0W',
                         #:d => {:auth_data => 'something'},
                         :log_method => method(:puts),
                         # `auth_ttl` describes when we should refresh the auth
                         # token. Set it to `false` to disable auto-refreshing.
                         # The default is 23 hours.
                         :auth_ttl => 82800,
                         # `auth` is the auth token from Firebase. Leave it alone
                         # to auto-generate. Set it to `false` to disable it.
                         :auth => false # Ignore auth for this example!

    #create new list. Setup emebedded Timer object with stopped state and 0 duration
    @list = List.new(title: params[:title], active_list_item: "", timer: {state: "stopped", action_time: Time.now.to_i, duration: 0})
    
    response = f.post(
      "#{@list.id}", 
      { 
        title: params[:title], 
        active_list_item: "", 
        timer: {
          state: "stopped", 
          action_time: Time.now.to_i, 
          duration: 0
        } 
      }
    )

    if @list.save
      render json: @list, status: :created
    else
      render json: @list.errors, status: :unprocessable_entity
    end

  end

  #PATCH /lists/:id
  def update
    @list = List.find(params[:id])

    if @list.update_attributes(list_edit_params)
      render json: @list, status: :ok
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  #DELETE /lists/:id
  def destroy
    @list = List.find(params[:id])

    if @list.destroy
      render json: @list, status: :no_content
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  private

  def list_edit_params
    params.permit(:title)
  end

end
